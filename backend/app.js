const express = require('express');
const chalk = require('chalk');
const helmet = require('helmet');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const expressFileUpload = require('express-fileupload');
const expressRateLimit = require('express-rate-limit');

require('dotenv')
    .config();

const {
    crossOrigin: { _configureCors },
    notFound: {
        _notFoundError,
        _mainErrorHandler
    }
} = require('./helper');
const { apiRouter } = require('./routes/api');

const {
    constants: { DEV },
    variables: {
        PORT,
        DB_CONNECTION_URL
    }
} = require('./config');
const cronJobs = require('./cron');
const { UserModel } = require('./dataBase');
const swaggerJson = require('./docs/swagger.json');

const app = express();

mongoose.connect(DB_CONNECTION_URL);

app.use(helmet());

app.use(cors({ origin: _configureCors }));

app.use(expressRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload());

if (process.env.NODE_ENV === DEV) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const morgan = require('morgan');
    app.use(morgan(DEV));
}

app.use('/', apiRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.use('*', _notFoundError);
app.use(_mainErrorHandler);

app.listen(PORT, async (err) => {
    await UserModel.setOwner();

    if (err) {
        console.log(err);
    }

    console.log(chalk.greenBright(`${PORT} hi boss!`));

    cronJobs();
});
