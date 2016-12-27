#include <SoftwareSerial.h>
#include <Servo.h> 
#include <LiquidCrystal.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);
//SoftwareSerial XBee(0, 1);

int servoPin = 2; 
Servo Servo1;
bool rotationFlag;

void setup() {
  Serial.begin(9600);
  Servo1.attach(servoPin);
  Servo1.write(90);
  lcd.begin(16, 2);
  rotationFlag = true;
}

void loop() {
  if(Serial.available() > 0) { // Check if any data is available on the serial port
    //String msg = "[M]Paresh Chouhan,W-001,C-2";
    
    Serial.println("Receiving data");
    delay(1000);
    String msg =Serial.readString();
    
    Serial.println(msg);

    if(msg == "[N]") {
      lcd.setCursor(0,0);
      lcd.println("CONNECTION          ");
      lcd.setCursor(0,1);
      lcd.println("ESTABLISHED         ");
      delay(5000); 
    }

    lcd.setCursor(0,0);
    
    String patient;
    
    int i;

    for (i = 0; msg[i]; i ++) {
      if(msg[i] == ']') break;
    }

    i ++;

    int prev_i = i;
    
    for ( ; msg[i]; i ++) {
      if(msg[i] == ',') break;
      patient += msg[i];
    }
    
    for (int j = i; j < 16 + prev_i; j ++) {
      patient += ' ';
    }
    
    
    Serial.println(patient);
    lcd.println(patient);
    i ++;
    
    lcd.setCursor(0,1);
    
    
    Serial.println(i);
    String ward = "W: ";
    
    for ( ; msg[i]; i ++) {
        if(msg[i] == ',') break;
        ward += msg[i];
    }
    
    ward += ' ';
    Serial.println(ward);
    i ++;
    
    int _size = ward.length();
    
    lcd.println(ward);
    String compartment = "C: ";
    
    lcd.setCursor(_size,1);
    
    for ( ; msg[i]; i ++) {
      compartment += msg[i];  
    }
    
    compartment += " ";
    for (int j = i; j < 40
    ; j ++) {
      compartment += " ";  
    }
    
    
    Serial.println(compartment);
    lcd.println(compartment);
    
    
    /*if(rotationFlag == true) {
      Servo1.write(-360);
    }
    else {
      Servo1.write(360);
    }
    */
    
    if(msg[0] and msg != "[N]") {
      for (int angle = 80; angle >= 0; angle -= 10) {
        delay(79.5);
        Servo1.write(angle);
      }
      //Servo1.write(0);
      delay(7000);

      for (int angle = 0; angle <= 90; angle += 10) {
        delay(79.5);
        Servo1.write(angle);
      }

      Serial.write("[C]");
      //Servo1.write(90);  
    }
    else {
      lcd.setCursor(0,0);
      String empty = "                ";
      lcd.println(empty);
      lcd.setCursor(0,1);
      lcd.println(empty);
    }
  }
  
  /*else
  {
    Serial.println("not availlable...");
    delay(2000);
  } */
}
