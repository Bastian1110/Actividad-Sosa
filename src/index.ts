import Server from "./providers/Server";
import express from "express";
import cors from 'cors';
import UserController from "./controllers/UserController";
import CuentaController from "./controllers/CuentaController";
import AuthenticationController from "./controllers/AuthenticationController";
import AgenteController from "./controllers/AgenteController";

const app = new Server({
    port:8080,
    middlewares:[
        express.json(),
        express.urlencoded({extended:true}),
        cors()
    ],
    controllers:[
        UserController.getInstance(),
        AuthenticationController.getInstance(),
        CuentaController.getInstance(),
        AgenteController.getInstance()
    ],
    env:'development'
});

declare global{
    namespace Express{
        interface Request{
            user:string;
            token:string;
        }
    }
}

app.init();