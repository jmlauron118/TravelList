INSERT
INTO
    TRAVEL_DETAILS
(
    PLACE,
    DESCRIPTION,
    DATE,
    PLACE_IMG,
    DATE_CREATED
)
VALUES
(
    ?,
    ?,
    ?,
    ?,
    datetime(CURRENT_TIMESTAMP, 'localtime')
);