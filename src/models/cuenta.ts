'use strict';

import {Model} from 'sequelize';

interface CuentaAttributes{
  id:number,
  user_id : string,
  balance : number 
}

module.exports = (sequelize:any, DataTypes:any) => {
  class Cuenta extends Model<CuentaAttributes> implements CuentaAttributes {
    id!:number;
    user_id!:string;
    balance!:number;
  }
  Cuenta.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    balance:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    user_id:{
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Cuenta',
  });
  return Cuenta;
};