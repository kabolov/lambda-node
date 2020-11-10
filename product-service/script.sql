create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

create table stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
)

insert into products (title, description, price) values
('Item #1 from PG', 'First item added to a database', 100),
('Item #2 from PG', 'Second item added to a database', 200);

insert into stocks (product_id, count) values
('d22f957c-17a1-43bd-8b47-82bede3ce204', 2),
('6497a92c-3627-496a-ab26-8ac064233f80', 18)