from fastapi import HTTPException, status


class PartNotFoundException(HTTPException):
    def __init__(self, part_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Part with id {part_id} not found"
        )


class CategoryNotFoundException(HTTPException):
    def __init__(self, category_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found"
        )


class BinNotFoundException(HTTPException):
    def __init__(self, bin_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bin with id {bin_id} not found"
        )


class DocumentNotFoundException(HTTPException):
    def __init__(self, document_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with id {document_id} not found"
        )


class SettingNotFoundException(HTTPException):
    def __init__(self, setting_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Setting with id {setting_id} not found"
        )


class PartSpecificationNotFoundException(HTTPException):
    def __init__(self, spec_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Part specification with id {spec_id} not found"
        )


class DatabaseConnectionError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error"
        )


class InvalidFileTypeException(HTTPException):
    def __init__(self, expected_types: list):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Expected one of: {', '.join(expected_types)}"
        )