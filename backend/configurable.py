from abc import ABC, abstractmethod
from pathlib import Path
import tomllib
from typing import Self
from pydantic import BaseModel


class Configurable(ABC):
    """Abstract base class for objects that can be created from configuration."""

    Config: type[BaseModel]

    @classmethod
    @abstractmethod
    def from_config(cls, config: BaseModel) -> Self:
        """Create an instance from a validated config model."""
        ...

    @classmethod
    def from_config_path(cls, config_path: Path) -> Self:
        """Load config from TOML file and create instance."""
        with open(config_path, "rb") as f:
            config_dict = tomllib.load(f)

        config = cls.Config.model_validate(config_dict)
        return cls.from_config(config)
