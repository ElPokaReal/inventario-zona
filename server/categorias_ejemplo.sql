-- Script para insertar categorías de ejemplo en el sistema de inventario
-- Ejecutar después de crear la base de datos

INSERT INTO categorias (nombre, descripcion, esta_activa, fecha_creacion, fecha_actualizacion) VALUES
('Equipos de Computación', 'Computadoras, laptops, tablets y dispositivos informáticos principales', true, NOW(), NOW()),
('Periféricos', 'Mouse, teclados, monitores, impresoras y otros dispositivos periféricos', true, NOW(), NOW()),
('Cables y Conectores', 'Cables de red, USB, HDMI, VGA y otros tipos de conectores', true, NOW(), NOW()),
('Software', 'Licencias de software, sistemas operativos y aplicaciones', true, NOW(), NOW()),
('Herramientas', 'Herramientas de mantenimiento, destornilladores, pinzas y equipos técnicos', true, NOW(), NOW()),
('Consumibles', 'Tintas, cartuchos, papel y otros materiales consumibles', true, NOW(), NOW()),
('Equipos de Red', 'Routers, switches, puntos de acceso y equipos de conectividad', true, NOW(), NOW()),
('Almacenamiento', 'Discos duros, SSDs, memorias USB y dispositivos de almacenamiento', true, NOW(), NOW()),
('Equipos de Seguridad', 'Cámaras de vigilancia, sistemas de control de acceso y seguridad', true, NOW(), NOW()),
('Mobiliario', 'Escritorios, sillas, estantes y mobiliario de oficina', true, NOW(), NOW()),
('Equipos de Audio/Video', 'Micrófonos, altavoces, proyectores y equipos multimedia', true, NOW(), NOW()),
('Equipos de Energía', 'UPS, estabilizadores, baterías y equipos de respaldo energético', true, NOW(), NOW()),
('Equipos de Limpieza', 'Aspiradoras, productos de limpieza y equipos de mantenimiento', true, NOW(), NOW()),
('Equipos Médicos', 'Dispositivos médicos, termómetros y equipos de salud', true, NOW(), NOW()),
('Equipos de Laboratorio', 'Instrumentos de laboratorio, microscopios y equipos científicos', true, NOW(), NOW()),
('Equipos de Comunicación', 'Teléfonos, radios, intercomunicadores y equipos de comunicación', true, NOW(), NOW()),
('Equipos de Iluminación', 'Lámparas, focos LED, reflectores y equipos de iluminación', true, NOW(), NOW()),
('Equipos de Climatización', 'Aires acondicionados, ventiladores y equipos de control térmico', true, NOW(), NOW()),
('Equipos de Oficina', 'Fotocopiadoras, escáneres, calculadoras y equipos administrativos', true, NOW(), NOW()),
('Equipos de Transporte', 'Carros, montacargas y equipos de movilidad interna', true, NOW(), NOW());

-- Verificar la inserción
SELECT * FROM categorias ORDER BY fecha_creacion DESC; 