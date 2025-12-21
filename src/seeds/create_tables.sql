USE app_gh;

-- ROLES
CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- PERMISOS
CREATE TABLE permiso (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- RELACIÓN ROL - PERMISO
CREATE TABLE rol_permiso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_rol INT NOT NULL,
    fk_id_permiso INT NOT NULL,
    FOREIGN KEY (fk_id_rol) REFERENCES rol(id_rol),
    FOREIGN KEY (fk_id_permiso) REFERENCES permiso(id_permiso)
);

-- USUARIOS
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fk_id_rol INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (fk_id_rol) REFERENCES rol(id_rol)
);

-- EMPLEADOS (tabla central del Excel)
CREATE TABLE empleado (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    documento VARCHAR(20),
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE
);
