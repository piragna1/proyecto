drop database if exists turnera;
create database if not exists turnera;
use turnera;
drop table if exists usuarios;
create table if not exists usuarios(
	id int auto_increment primary key,
    nombre varchar(100) not null,
    email varchar(100) not null unique,
    telefono varchar(14) not null unique,
    clave varchar(255) not null,
    rol varchar(25) not null,
    superadmin boolean not null,
    direccion varchar(100)
);
drop table if exists servicios;
create table if not exists servicios(
	id int auto_increment primary key,
    tipo varchar(50) not null unique,
    duracion_minutos int not null,
    precio float not null
);
drop table if exists turnos;
create table if not exists turnos(
id int auto_increment primary key,
id_usuario int not null,
id_servicio int not null,
fecha_hora_inicio varchar(100) not null,
fecha_hora_fin varchar(100) not null,
    constraint fk_turnos_usuario foreign key (id_usuario) references usuarios(id) ON DELETE CASCADE,
    constraint fk_turnos_servicio foreign key (id_servicio) references servicios(id) ON DELETE CASCADE
);
