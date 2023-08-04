interface WeatherData {
    main: {
      temp: number;
    };
    weather: [
      {
        description: string;
        icon: string;
      }
    ];
  }

 