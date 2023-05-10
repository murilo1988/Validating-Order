-- Active: 1682377918663@@127.0.0.1@5432@postgres
drop table cacct11.product;
drop table cacct11.coupon;
drop schema cacct11;

create SCHEMA cacct11;



create table cacct11.product (
	id_product integer,
	description text,
	price numeric,
	width integer,
	height integer,
	length integer,
	weight numeric
);

insert into cacct11.product (id_product, description, price, width, height, length, weight) values (1, 'A', 1000, 100, 30, 10, 3);
insert into cacct11.product (id_product, description, price, width, height, length, weight) values (2, 'B', 5000, 50, 50, 50, 22);
insert into cacct11.product (id_product, description, price, width, height, length, weight) values (3, 'C', 30, 10, 10, 10, 0.9);
insert into cacct11.product (id_product, description, price, width, height, length, weight) values (4, 'C', 30, -10, -10, -10, 1);
insert into cacct11.product (id_product, description, price, width, height, length, weight) values (5, 'C', 30, 10, 10, 10, -1);

create table cacct11.coupon (
	code text,
	percentage numeric,
	expire_date timestamp
);

insert into cacct11.coupon (code, percentage, expire_date) values ('VALE20', 20, '2023-10-01T10:00:00');
insert into cacct11.coupon (code, percentage, expire_date) values ('VALE10', 10, '2022-10-01T10:00:00');