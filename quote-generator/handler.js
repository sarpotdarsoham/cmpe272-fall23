'use strict';
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const quotes = [
    "To be or not to be, that is the question.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "A man is known by the company he keeps.",
    "You wanna increase your self confidence? Follow your promises.",
];

function getPresignedUrl(bucket, key) {
    const params = {
        Bucket: bucket,
        Key: key,
        Expires: 3600 
    };
    return S3.getSignedUrl('getObject', params);
}

module.exports.generateQuote = async (event) => {
    try {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const keyName = `quote-${Date.now()}.txt`;

        const response = await S3.putObject({
            Bucket: 'myfavoritequotesss',
            Key: keyName,
            Body: randomQuote,
            ContentType: 'text/plain',
        }).promise();

        const presignedUrl = getPresignedUrl('myfavoritequotesss', keyName);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Quote generated!',
                url: presignedUrl,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};
