create view libros_mas_vendidos as
select lb.*, count(lb.id) as ventas
from libro lb join factura_libro fl on(lb.id = fl.libro_id)
			  join factura fac on(fac.id = fl.factura_id)
              join estado_factura ef on (fac.estado_factura_id = ef.id)
where ef.estado='pagada'
group by lb.id
order by ventas desc;

create view libros_mas_vendidos_2024 as
select lb.*, count(lb.id) as ventas
from libro lb join factura_libro fl on(lb.id = fl.libro_id)
			  join factura fac on(fac.id = fl.factura_id)
              join estado_factura ef on (fac.estado_factura_id = ef.id)
where ef.estado='pagada' and lb.publicacion_year='2024'
group by lb.id
order by ventas desc;