import logging
import sys

import logging
import sys

class DeskLogger:
    def __init__(self) -> None:
        self.formatter = logging.Formatter("%(levelname)s: %(asctime)s - %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
        
        self.handler = logging.FileHandler("desk.log")
        self.handler.setFormatter(self.formatter)
        
        self.errorHandler = logging.FileHandler("error.log")
        self.errorHandler.setLevel(logging.ERROR)
        self.errorHandler.setFormatter(self.formatter)
        
        self.streamHandler = logging.StreamHandler()
        self.streamHandler.setFormatter(self.formatter)
        
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG) 
        
        self.logger.addHandler(self.handler)
        self.logger.addHandler(self.errorHandler)
        self.logger.addHandler(self.streamHandler)
        
        sys.excepthook = self.log_uncaught_exceptions

    def info(self, msg: str):
        self.logger.info(msg)
    
    def debug(self, msg: str):
        self.logger.debug(msg)
    
    def warning(self, msg: str):
        self.logger.warning(msg)
    
    def error(self, msg: str):
        self.logger.error(msg)
    
    def log_uncaught_exceptions(self, ex_cls, ex, tb):
        self.logger.critical("Uncaught exception", exc_info=(ex_cls, ex, tb))

deskLogger = DeskLogger()