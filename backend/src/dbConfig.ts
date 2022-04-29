import { Dialect } from 'sequelize/types';

const DBConfig =
{
    dbNAME : 'postgres',
    dbUSER : 'postgres',

    dbPASSWORD : 'changeme1',

    dbOptions : {
        host: 'localhost',
        dialect: 'postgres' as Dialect
    }
};
export default DBConfig;
