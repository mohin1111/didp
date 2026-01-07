from fastapi import APIRouter

from .v1 import tables, relationships, value_mappings, match_configs, matching, imports, sql, python, exports, processes

api_router = APIRouter()

api_router.include_router(tables.router)
api_router.include_router(relationships.router)
api_router.include_router(value_mappings.router)
api_router.include_router(match_configs.router)
api_router.include_router(matching.router)
api_router.include_router(imports.router)
api_router.include_router(sql.router)
api_router.include_router(python.router)
api_router.include_router(exports.router)
api_router.include_router(processes.router)
