# ProyectosMS2026

Monorepo de la plataforma de microservicios distribuidos 2026.

## Estructura

| Carpeta | Descripcion |
|---|---|
| `erpng/` | Frontend Angular 21 (ERP) que consume los microservicios via Gateway |
| `auth/` | Microservicio de autenticacion (Spring Boot + JWT) |
| `catalogo/` | Microservicio de categorias (Spring Boot + MySQL) |
| `producto/` | Microservicio de productos (Spring Boot + MySQL) |
| `infra/` | Infraestructura: `config-server`, `registry-server` (Eureka), `gateway`, `config-repo` |

## Puertos

| Servicio | Puerto |
|---|---:|
| Frontend Angular (erpng) | 4200 |
| Config Server | 7071 |
| Eureka Registry | 7081 |
| Gateway | 7091 |
| auth | 8041 |
| catalogo | 8081 |
| producto | 9091 |
| MySQL auth | 3341 |
| MySQL catalogo | 3381 |
| MySQL producto | 3391 |

## Orden de arranque

1. `infra/config-server`
2. `infra/registry-server`
3. `infra/gateway`
4. Bases de datos MySQL (`docker compose -f docker-compose-dev.yml up -d` en cada microservicio)
5. Microservicios: `auth`, `catalogo`, `producto`
6. Frontend: `cd erpng && ng serve`
