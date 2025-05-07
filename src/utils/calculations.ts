// Constants for emission calculations
const F1_EMISSION_PER_LAP = 7.48; // kg of CO2
const FE_EMISSION_PER_LAP = 0.10; // kg of CO2

// Calculate emissions for a lap
export const calculateEmissions = (completed: boolean) => {
  if (!completed) {
    return {
      f1Emission: 0,
      feEmission: 0,
      difference: 0
    };
  }

  return {
    f1Emission: F1_EMISSION_PER_LAP,
    feEmission: FE_EMISSION_PER_LAP,
    difference: F1_EMISSION_PER_LAP - FE_EMISSION_PER_LAP
  };
};

// Format time from seconds to mm:ss.SSS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

// Parse time from mm:ss.SSS to seconds
export const parseTime = (timeString: string): number => {
  const [minutePart, secondPart] = timeString.split(':');
  const [seconds, milliseconds = '0'] = secondPart.split('.');
  
  const mins = parseInt(minutePart, 10);
  const secs = parseInt(seconds, 10);
  const ms = parseInt(milliseconds.padEnd(3, '0'), 10);
  
  return mins * 60 + secs + ms / 1000;
};

// Format environmental impact message
export const getEnvironmentalImpact = (laps: number): string => {
  const totalDifference = laps * (F1_EMISSION_PER_LAP - FE_EMISSION_PER_LAP);
  const carDistance = Math.round(totalDifference * 67.8); // Approximate km per kg of CO2
  
  return `Com ${laps} ${laps === 1 ? 'volta' : 'voltas'}, você teria emitido o mesmo que dirigir ${carDistance} km com um carro a gasolina.`;
};