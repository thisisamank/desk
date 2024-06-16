import logging
import json



class DeskLogger:

    def __init__(self) -> None:
        self.formatter = logging.Formatter("%(levelname)s: %(asctime)s - %(message)s",datefmt="%Y-%m-%d %H:%M:%S")
        self.handler = logging.StreamHandler()
        self.logger = logging.getLogger(__name__)
        self.handler.setFormatter(self.formatter)
        self.logger.setLevel(logging.INFO)
        self.logger.addHandler(self.handler)


    def info(self,msg: str):
        self.logger.info(msg=msg)
    
    def error(self, msg: str):
        self.logger.error(msg, exc_info=True)


deskLogger = DeskLogger()