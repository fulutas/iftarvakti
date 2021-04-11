# İftar vakti ve diğer vakitler yer almaktadır.

# Screenshot
![alt text](https://github.com/fulutas/iftarvakti/blob/main/SS/Screenshot_2.png)


# Kullanılan Ezan Vakti API
Tüm dünya Ülkeleri için Diyanet İşleri Başkanlığı'nın aylık ezan vakitleri.

Kullanım
Ülkeler Listesi:/ulkeler
Şehirler Listesi:/sehirler/{ULKE_KODU}
İlçeler Listesi:/ilce/{SEHIR_KODU}
Vakitler:/vakitler/{ILCE_KODU}
Şehrin tüm ilçeleri için Bayram Namazı Saatleri:/bayram-namazi/{SEHIR_KODU}
Rate-limit
100 istek / 1 gün ve 20 istek / 15 dakika (Namaz vakitleri 30 günlük verildiği için ayda 1 istek yeterlidir.)

API Sağlayıcı:
https://ezanvakti.herokuapp.com/
