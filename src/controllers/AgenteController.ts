import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { Op } from "sequelize";
import db from "../models";

class AgenteController extends AbstractController {
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }
  //Singleton
  //Atributo de clase
  private static instance: AgenteController;
  //Método de clase
  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new AgenteController("agente");
    return this.instance;
  }
  protected initRoutes(): void {
    this.router.get(
      "/consultarCuentas",
      [
        this.authMiddleware.verifyToken,
        this.permissionMiddleware.checkIsSupervisor,
      ],
      this.getConsultarCuentas.bind(this)
    );
    this.router.get(
      "/segementacion",
      [
        this.authMiddleware.verifyToken,
        this.permissionMiddleware.checkIsSupervisor,
      ],
      this.getSegmentacion.bind(this)
    );
    //Todas las rutas que necesite su controlador
  }
  private async getConsultarCuentas(req: Request, res: Response) {
    try {
      let result = await db["Cuenta"].findAll();
      res.status(200).send({ cuentas: result });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }
  private async getSegmentacion(req: Request, res: Response) {
    const { min, max } = req.body;
    try {
      let result = await db["Cuenta"].findAll({
        where: { balance: { [Op.gt]: min, [Op.lt]: max } },
      });
      res.status(200).send({ cuentas: result });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }
}

export default AgenteController;
