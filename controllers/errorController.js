const errorController = {};

errorController.triggerError = (req, res, next) => {
    // Trigger the error
    next(new Error ("Server Error"));
}

module.exports = errorController;