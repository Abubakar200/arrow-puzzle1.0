const level1 = {
    id: 1,

    gridSize: 5,

    arrows: [

        // Top row
        {
            row: 0,
            col: 0,
            direction: "left"
        },

        {
            row: 0,
            col: 2,
            direction: "up"
        },

        {
            row: 0,
            col: 4,
            direction: "right"
        },


        // Second row
        {
            row: 1,
            col: 1,
            direction: "left"
        },

        {
            row: 1,
            col: 3,
            direction: "up"
        },


        // Middle row
        {
            row: 2,
            col: 0,
            direction: "left"
        },

        {
            row: 2,
            col: 2,
            direction: "down"
        },

        {
            row: 2,
            col: 4,
            direction: "right"
        },


        // Fourth row
        {
            row: 3,
            col: 1,
            direction: "down"
        },

        {
            row: 3,
            col: 3,
            direction: "right"
        },


        // Bottom row
        {
            row: 4,
            col: 0,
            direction: "left"
        },

        {
            row: 4,
            col: 2,
            direction: "down"
        },

        {
            row: 4,
            col: 4,
            direction: "right"
        }

    ]
};

export default level1;