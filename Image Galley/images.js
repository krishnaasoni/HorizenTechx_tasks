
const images = [
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCXS3GloAtphVwqlpIQpRbe5vzMbFlmBh6eibNQUy_Xg&s=10", 
        category: "nature", 
        title: "Mountain Peak" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf_pisuNKDTGgJPzwxoaumM3s6PD0Kp5ze8Deh1SFDcw&s=10", 
        category: "travel", 
        title: "Beach Paradise" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYH2JJl8SyTtlUCQtIAdp9jPGKYDnPG1u83sBWPYEzuQ&s=10", 
        category: "travel", 
        title: "Desert Journey" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfH0XYtmyJDbZmpY3zyCPQ6hQFrP4rvn8w20Wollomjw&s=10", 
        category: "travel", 
        title: "City Lights" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmx_7fwI8zF52AX7oFcGuIu1ZI3DaxlnFPC8ZSwMOHFg&s=10", 
        category: "nature", 
        title: "Forest Green" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ38LpMGHeY8-qveGn3_sc5AIno8ZnXNDfSeGQYEATorw&s=10", 
        category: "nature", 
        title: "Sunset View" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRntsVWjLrbccUYiITqEnalpL6F3IuHa6MmFE527B8peg&s=10", 
        category: "nature", 
        title: "Waterfall" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXHKTbpWhZoJ97pGhwOXWKVXlnk2pttpwE_S0czOuIkA&s=10", 
        category: "nature", 
        title: "Lake Serenity" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPGoxAQXjMgATP7RGfpVEepChsSd6ii4tFt2ABigqEww&s=10", 
        category: "nature", 
        title: "Mountain Vista" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQca_aRrd_E6Qgh_Q1FneyHcPgLva3PSto9Vox-rqVobA&s=10", 
        category: "travel", 
        title: "Adventure Awaits" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpUibDKJqjRmlMZ0Znj6QBzioekb7sEHStIJZxLFg3BQ&s=10", 
        category: "travel", 
        title: "Tropical Island" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5zCu23-viXUiiLbNoUXCDt390MtTFuBYOCpsrAzyaiw&s=10", 
        category: "travel", 
        title: "Urban Explore" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT8Z1PSFa14qpEWrJlIPosnnY6LYKYwm4tVu1OsIAk6A&s=10", 
        category: "nature", 
        title: "Wild Nature" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_QZ60PbIGLyBGAxHqLuw3fXpCTKxH-6c4oOXohM0NaPgVFnaRykYk69w&s=10", 
        category: "nature", 
        title: "Morning Mist" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM6o7_XeQZFxRMcBNvRA88vyRSwC5cEltO1DcbRRSk_nFlROHsNCNbCUQ&s=10", 
        category: "travel", 
        title: "Cultural Heritage" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXKf-Yxse-CRbMXmA9c247reO_K84pAtTageSM1A1LFQ&s=10", 
        category: "car", 
        title: "Sport Car" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2unc6IOyp4VT1d0HlEUMtpqozmyEM1emTCJT03YKqQ&s=10", 
        category: "car", 
        title: "Luxury Ride" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI7njOXbuwNRzprqie--_imJuHMj3iWL0hoNdPOW4WNA&s=10", 
        category: "car", 
        title: "Classic Car" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7IQPGL-61B67vyyKdFeZMGzNeCQ3Zlw0tOweQs95TBQ&s=10", 
        category: "car", 
        title: "Speed Machine" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_SMem89TRAZogxQOe7e9vdkUD_TBrh0lMRRC8nkTNiQ&s=10", 
        category: "car", 
        title: "Elegant Design" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpH_F-NfABmbEbhw-aoRcxlxpRiJGtcs8rvKqikEx_cQ&s=10", 
        category: "car", 
        title: "Modern Motorcar" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS5w1qVBo5lF5GhXSa5f5UG5w_PxF1qCtTovFxl6o3zYOFwhOJ6_iQZ_mz&s=10", 
        category: "car", 
        title: "Performance Car" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyd5hAyb2wrw5STrBLuHuunkRn6DBgyX0QgV6u-3q29Q&s=10", 
        category: "car", 
        title: "Future Ride" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHm2tdYt2Y6UpOfJvEUHOJ6rfGSCEvGHLZkcMuiBg0YQ&s", 
        category: "car", 
        title: "Dream Car" 
    },
    { 
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXdNpCqWoBwPIAVnug-zKLm_xfCgEVlvTiS1CCgkDRQ&s=10", 
        category: "car", 
        title: "Speedster" 
    }
];