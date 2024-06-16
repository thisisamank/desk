import logging
import json



class DeskLogger:

    def __init__(self) -> None:
        self.formatter = logging.Formatter("%(levelname)s: %(asctime)s - %(message)s",datefmt="%Y-%m-%d %H:%M:%S")
        self.handler = logging.FileHandler("desk.log")
        self.errorHandler = logging.FileHandler("error.log")
        self.streamHandler = logging.StreamHandler()
        self.streamHandler.setFormatter(self.formatter)
        self.logger = logging.getLogger(__name__)
        self.errorHandler.setLevel(logging.ERROR)
        self.errorHandler.setFormatter(self.formatter)
        self.handler.setFormatter(self.formatter)
        self.logger.setLevel(logging.INFO)
        self.logger.addHandler(self.handler)
        self.logger.addHandler(self.errorHandler)
        self.logger.addHandler(self.streamHandler)


    def info(self,msg: str):
        self.logger.info(msg=msg),
    
    def error(self, msg: str):
        self.logger.error(msg)


deskLogger = DeskLogger()