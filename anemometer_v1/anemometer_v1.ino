int ledPin = 9;

void setup() {
 Serial.begin(9600);
}

void loop() {
 int sensorValue = analogRead(A0);
// int sensorValue2 = analogRead(A1);

 //Map 0-1023 to discrete 0-50-100...250 values for LED
 analogWrite(ledPin, sensorValue * (51.0 / 1023.0) * 50);
// analogWrite(ledPin, sensorValue2 * (51.0 / 1023.0) * 50);

 
 if(sensorValue > 0){
    Serial.println(sensorValue);
    Serial.print(" ");
 }
// if(sensorValue2 > 0){
//    Serial.println(sensorValue2);
//    Serial.print(" ");
// }
 
}
