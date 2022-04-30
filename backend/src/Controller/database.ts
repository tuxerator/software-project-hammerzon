import { Sequelize } from 'sequelize';
import NameInfo from '../Models/NameInfo';
import DBConfig from '../dbConfig';
// For Initalasation/creation off every Database-Table and a database connection
export default class DatabaseController{

    constructor()
    {
        // Setup database Connection
        const sequelize = new Sequelize(DBConfig.dbNAME, DBConfig.dbUSER, DBConfig.dbPASSWORD, DBConfig.dbOptions);
        // NameInfoTable
        NameInfo.setup(sequelize);
        // In case the Table doesn't exist create a new one
        sequelize.sync();
    }
}
