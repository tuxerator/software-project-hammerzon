
import {Model, Sequelize,DataTypes} from 'sequelize';
// Model for Profile Page Name Infos
class NameInfo extends Model {
    declare id: number; // this is ok! The 'declare' keyword ensures this field will not be emitted by TypeScript.

    declare firstName: string;
    declare lastName: string;
    declare optionalAttribut?: string;
    // Initializes NameInfo-Class as Table on Datenbase
    static setup(sequelize:Sequelize):void
    {
        NameInfo.init(
            {
                // Model attributes are defined here
                firstName: {type: DataTypes.STRING,allowNull: false},

                lastName: {type: DataTypes.STRING,allowNull:false},

                optionalAttribut:{type: DataTypes.STRING}
            },
            {
                // Other model options go here
                sequelize, // We need to pass the connection instance
                modelName: 'NameInfo' // We need to choose the model name
            }
        );
    }
}

export default NameInfo;
