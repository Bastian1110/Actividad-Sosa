import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class CuentaController extends AbstractController {
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }
  //Singleton
  //Atributo de clase
  private static instance: CuentaController;
  //Método de clase
  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new CuentaController("cuenta");
    return this.instance;
  }
  protected initRoutes(): void {
    this.router.post("/deposito", this.postDeposito.bind(this));
    this.router.post(
      "/retiro",
      this.authMiddleware.verifyToken,
      this.postRetiro.bind(this)
    );
    this.router.post(
      "/saldo",
      this.authMiddleware.verifyToken,
      this.postSaldo.bind(this)
    );
    //Todas las rutas que necesite su controlador
  }
  private async postDeposito(req: Request, res: Response) {
    try {
      const { email, deposito } = req.body;
      let result = await db["Cuenta"].findOne({ where: { user_id: email } });
      let balance = result.balance + deposito;
      await db["Cuenta"].update(
        { balance: balance },
        { where: { user_id: email } }
      );
      res.status(200).send({ saldo: balance });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }
  private async postRetiro(req: Request, res: Response) {
    try {
      const { email, retiro } = req.body;
      let result = await db["Cuenta"].findOne({ where: { user_id: email } });
      let balance = result.balance - retiro;
      if (balance < 0) {
        res
          .status(200)
          .send({ saldo: result.balance, message: "Saldo insuficiente" });
      } else {
        await db["Cuenta"].update(
          { balance: balance },
          { where: { user_id: email } }
        );
        res.status(200).send({ saldo: balance });
      }
      await db["Cuenta"].update(
        { balance: balance },
        { where: { user_id: email } }
      );
      res.status(200).send({ saldo: balance });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }
  private async postSaldo(req: Request, res: Response) {
    try {
      const { email } = req.body;
      let result = await db["Cuenta"].findOne({ where: { user_id: email } });
      res.status(200).send({ saldo: result.balance });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message }).end();
    }
  }
}

export default CuentaController;
