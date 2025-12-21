USE app_gh;

-- ADMIN: todos los permisos
INSERT INTO rol_permiso (fk_id_rol, fk_id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r, permiso p
WHERE r.nombre = 'ADMIN';

-- RRHH
INSERT INTO rol_permiso (fk_id_rol, fk_id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON p.nombre IN (
    'VER_EMPLEADOS',
    'CREAR_EMPLEADOS',
    'EDITAR_EMPLEADOS'
)
WHERE r.nombre = 'RRHH';

-- USUARIO
INSERT INTO rol_permiso (fk_id_rol, fk_id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON p.nombre = 'VER_EMPLEADOS'
WHERE r.nombre = 'USUARIO';
