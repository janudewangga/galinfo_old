const sequelize = require('sequelize');
const Op = sequelize.Op;
const config = require('./config');
const db = new sequelize(null, null, null, {
    dialect: 'sqlite',
    operatorsAliases: false,
    logging: false,
    storage: './glf.db',
    define: {
        timestamps: true,
        freezeTableName: true
    }
});
db.authenticate().then(() => {
    console.log('Database siap digunakan.')
}).catch(error => {
    console.log('Database bermasalah: ' + error);
});
const User = db.define('User', {
    id: {
        type: sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    username: {
        type: sequelize.STRING(100),
        allowNull: true
    },
    password: {
        type: sequelize.STRING(200),
        allowNull: true
    },
    akses: {
        type: sequelize.ENUM('administrator', 'operator', 'sales', 'finance', 'client'),
        allowNull: false,
        defaultValue: 'client'
    },
    status: {
        type: sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif'
    }
});
const Produk = db.define('Produk', {
    id: {
        type: sequelize.INTEGER(5).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: sequelize.STRING(100),
        allowNull: false
    },
    harga: {
        type: sequelize.DECIMAL(13, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    keterangan: {
        type: sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif'
    }
});
const Langganan = db.define('Langganan', {
    id: {
        type: sequelize.UUID,
        allowNull: false,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },
    harga: {
        type: sequelize.DECIMAL(13, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    keterangan: {
        type: sequelize.TEXT,
        allowNull: true
    },
    tanggalTagihan: {
        type: sequelize.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.NOW
    },
    status: {
        type: sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif'
    }
});
const Log = db.define('Log', {
    id: {
        type: sequelize.UUID,
        allowNull: false,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },
    aktivitas: {
        type: sequelize.ENUM('tambah', 'baca', 'ubah', 'hapus', 'masuk', 'keluar'),
        defaultValue: 'baca',
        allowNull: false
    },
    dataTerdampak: {
        type: sequelize.JSON,
        allowNull: true
    },
    keterangan: {
        type: sequelize.JSON,
        allowNull: true
    },
    ipAddress: {
        type: sequelize.STRING(100),
        allowNull: true
    },
    status: {
        type: sequelize.ENUM('sukses', 'gagal'),
        allowNull: false,
        defaultValue: 'sukses'
    }
});
User.belongsToMany(Produk, {
    as: 'produk',
    through: Langganan,
    foreignKey: 'idUser'
});
Produk.belongsToMany(User, {
    as: 'user',
    through: Langganan,
    foreignKey: 'idProduk'
});
Log.belongsTo(User, {
    foreignKey: 'idUser',
    as: 'user'
});
module.exports = {sequelize, Op, db, User, Produk, Langganan, Log};