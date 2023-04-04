import { Request, Response } from "express";
import { db } from "../models/db";
import bcrypt from "bcrypt";

interface RequestBody {
  nombre: string;
  apellidos: string;
  rut: string;
  email: string;
  whatsapp: string;
  telefono: string;
  password: string;
  whatsappProfesional: string;
  telefonoProfesional: string;
}

interface ActualizarProfesional {
  whatsapp: string;
  telefono: string;
  estudios: string;
  email: string;
  rubros: number[];
  especialidades: number[];
  intervenciones: number[];
  modalidades: number[];
  previsiones: number[];
  payment_methods: number[];
}

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const profesionales = await db.profesionales.findMany({
      include: { usuarios: true },
    });
    res.json(profesionales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// export const getProfessional = async (req: Request, res: Response) => {
//   try {
//     const id = Number(req.params.id);
//     const result = await db.usuarios.findFirst({
//       where: { profesionales: { some: { id } } },
//       include: {
//         profesionales: {
//           include: {
//             profesionales_especialidades: {
//               select: {
//                 especialidades: true,
//               },
//             },
//             profesionales_previsiones: {
//               select: {
//                 previsiones: true,
//               },
//             },
//             profesionales_rubros: {
//               select: {
//                 rubros: true,
//               },
//             },
//             profesionales_intervenciones: {
//               select: {
//                 intervenciones: true,
//               },
//             },
//             professionals_payment_methods: {
//               select: {
//                 payment_methods: true,
//               },
//             },
//             profesionales_modalidades: {
//               select: {
//                 modalidades: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     const { password, profesionales, ...basicInformation } = result;

//     const formatObject = {
//       ...basicInformation,

//       profesionales_previsiones: profesionales[0].profesionales_previsiones.map(
//         (item) => item.previsiones
//       ),

//       profesionales_especialidades:
//         profesionales[0].profesionales_especialidades.map(
//           (item) => item.especialidades
//         ),

//       professionals_payment_methods:
//         profesionales[0].professionals_payment_methods.map(
//           (item) => item.payment_methods
//         ),

//       profesionales_intervenciones:
//         profesionales[0].profesionales_intervenciones.map(
//           (item) => item.intervenciones
//         ),

//       profesionales_modalidades: profesionales[0].profesionales_modalidades.map(
//         (item) => item.modalidades
//       ),
//     };

//     res.send(formatObject);
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

export const getProfessional = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await db.usuarios.findFirst({
      where: { profesionales: { some: { id } } },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
        telefono: true,
        profesionales: {
          select: {
            especialidades: { include: { especialidades: true } },
            previsiones: { include: { previsiones: true } },
            rubros: { include: { rubros: true } },
            intervenciones: { include: { intervenciones: true } },
            payment_methods: {
              include: { payment_methods: true },
            },
            modalidades: { include: { modalidades: true } },
          },
        },
      },
    });

    const professional = result.profesionales[0];
    const formatObject = {
      ...result,
      profesionales_especialidades:
        professional.especialidades.map(
          (item) => item.especialidades
        ),
      profesionales_previsiones: professional.previsiones.map(
        (item) => item.previsiones
      ),
      profesionales_rubros: professional.rubros.map(
        (item) => item.rubros
      ),
      profesionales_intervenciones:
        professional.intervenciones.map(
          (item) => item.intervenciones
        ),
      professionals_payment_methods:
        professional.payment_methods.map(
          (item) => item.payment_methods
        ),
      profesionales_modalidades: professional.modalidades.map(
        (item) => item.modalidades
      ),
    };

    delete formatObject.profesionales;
    res.send(formatObject);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const registerProfessional = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      nombre,
      apellidos,
      rut,
      email,
      whatsapp,
      telefono,
      password,
      whatsappProfesional,
      telefonoProfesional,
    } = req.body as RequestBody;

    if (
      !nombre ||
      !apellidos ||
      !rut ||
      !email ||
      !whatsapp ||
      !whatsappProfesional ||
      !telefono ||
      !password ||
      !telefonoProfesional
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await db.usuarios.create({
      data: {
        nombre,
        apellidos,
        rut,
        whatsapp,
        telefono,
        password: hashedPassword,
      },
    });

    const profesional = await db.profesionales.create({
      data: {
        whatsapp: whatsappProfesional,
        telefono: telefonoProfesional,
        email,
        usuarios: {
          connect: {
            id: usuario.id,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Profesional creado con éxito",
      profesionalId: profesional.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updateProfessional = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const profesionalId = Number(req.params.id);
    if (!profesionalId) {
      res
        .status(400)
        .json({ message: "Falta el ID del profesional a actualizar" });
      return;
    }

    const {
      whatsapp,
      telefono,
      estudios,
      email,
      rubros,
      especialidades,
      intervenciones,
      modalidades,
      previsiones,
      payment_methods,
    } = req.body as ActualizarProfesional;

    const updatedProfesional = await db.profesionales.update({
      where: { id: profesionalId },
      data: {
        whatsapp,
        telefono,
        estudios,
        email,
        rubros: {
          deleteMany: {},
          create: rubros.map((id) => ({ rubro_id: id })),
        },
        especialidades: {
          deleteMany: {},
          create: especialidades.map((id) => ({ especialidad_id: id })),
        },
        intervenciones: {
          deleteMany: {},
          create: intervenciones.map((id) => ({ intervencion_id: id })),
        },
        modalidades: {
          deleteMany: {},
          create: modalidades.map((id) => ({ modalidad_id: id })),
        },
        previsiones: {
          deleteMany: {},
          create: previsiones.map((id) => ({ prevision_id: id })),
        },
        payment_methods: {
          deleteMany: {},
          create: payment_methods.map((id) => ({ payment_method_id: id })),
        },
      },
    });

    res.status(200).json({
      message: "Profesional actualizado con éxito",
      updatedProfesional,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
