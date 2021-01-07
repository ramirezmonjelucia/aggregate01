/*
Se quiere saber cuales son los productos que están en oferta
*/
db.ventas.aggregate( [
  {$match: 
    {"En Oferta": true } } ] );

/*{ "_id" : ObjectId("5ff758f7ffba74ff6c32ade5"), "Artículo" : "Cafetera", "Precio Unidad (€)" : 50, "NºUnidades" : 8, "Fecha Venta" : ISODate("2021-01-02T00:00:00Z"), "idCliente" : 2, "Vendedor" : "Nespresso", "Categoría" : "Electrodomésticos", "En Oferta" : true, "Modelo" : "S" }
{ "_id" : ObjectId("5ff758f7ffba74ff6c32ade6"), "Artículo" : "Cafetera", "Precio Unidad (€)" : 70, "NºUnidades" : 4, "Fecha Venta" : ISODate("2020-12-27T00:00:00Z"), "idCliente" : 3, "Vendedor" : "Cecotec", "Categoría" : "Electrodomésticos", "En Oferta" : true, "Modelo" : "S" }
{ "_id" : ObjectId("5ff758f7ffba74ff6c32ade8"), "Artículo" : "Cafetera", "Precio Unidad (€)" : 100, "NºUnidades" : 2, "Fecha Venta" : ISODate("2020-12-19T00:00:00Z"), "idCliente" : 3, "Vendedor" : "Nespresso", "Categoría" : "Electrodomésticos", "En Oferta" : true, "Modelo" : "XL" }*/ 

/*
Se quiere saber cuales son los modelos que se ofrecen y cuales son sus diferentes marcas
*/

db.ventas.aggregate( [
    {$group :
       { _id :  "$Modelo", 
       Marcas: 
       { $push: "$Vendedor" } } } ] ). pretty ()

/*
{
        "_id" : "S",
        "Marcas" : [
                "Nespresso",
                "Dolce Gusto",
                "Cecotec",
               
        ]
}
{
        "_id" : "XL",
        "Marcas" : [
                "Nespresso",
                "Dolce Gusto",
               
        ]
}*/

/*
Se quiere saber cuanto dinero se ha ganado en 2019 por días 
*/

db.ventas.aggregate( [
   {$match: {"Fecha Venta": 
    { 
     $gte: new Date("2019-01-01"), 
     $lt: new Date("2020-01-01")
    } } },
   {$group: { _id: 
    {
        dia: { $dayOfMonth: "$Fecha Venta" },
        mes: { $month: "$Fecha Venta" },
        año: { $year: "$Fecha Venta" } 
    },
VentasTotales: {$sum:
  {$multiply: ["$Precio Unidad (€)", "$NºUnidades"] } } } } ] ) ;

/*
{ "_id" : { "dia" : 4, "mes" : 9, "año" : 2019 }, "VentasTotales" : 480 }
{ "_id" : { "dia" : 16, "mes" : 1, "año" : 2019 }, "VentasTotales" : 800 }
{ "_id" : { "dia" : 20, "mes" : 1, "año" : 2019 }, "VentasTotales" : 250 }
{ "_id" : { "dia" : 19, "mes" : 2, "año" : 2019 }, "VentasTotales" : 50 }
{ "_id" : { "dia" : 5, "mes" : 11, "año" : 2019 }, "VentasTotales" : 480 }
*/

/*
Se quiere saber que modelo se ha vendido más
 */

db.ventas.aggregate( [ 
  {$group: 
    {_id: "$Modelo",
    
      "Dinero recaudado":
    {$sum:{ $multiply: [ "$Precio Unidad (€)", "$NºUnidades" ] } } } } ] );

/*
{ "_id" : "XL", "Dinero recaudado" : 1240 }
{ "_id" : "S", "Dinero recaudado" : 2640 }
 */

/*
Cuantas cafeteras han sido vendidas 
*/

db.ventas.aggregate( [
  {$group:
     { _id: "$Artículo",
           Cantidad: { $sum: 1 } } } ] );

/*
 { "_id" : "Cafetera", "Cantidad" : 10 }
*/