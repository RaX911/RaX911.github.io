const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const provinces = [
  { code: '11', name: 'Aceh' },
  { code: '12', name: 'Sumatera Utara' },
  { code: '13', name: 'Sumatera Barat' },
  { code: '14', name: 'Riau' },
  { code: '15', name: 'Jambi' },
  { code: '16', name: 'Sumatera Selatan' },
  { code: '17', name: 'Bengkulu' },
  { code: '18', name: 'Lampung' },
  { code: '19', name: 'Kepulauan Bangka Belitung' },
  { code: '21', name: 'Kepulauan Riau' },
  { code: '31', name: 'DKI Jakarta' },
  { code: '32', name: 'Jawa Barat' },
  { code: '33', name: 'Jawa Tengah' },
  { code: '34', name: 'DI Yogyakarta' },
  { code: '35', name: 'Jawa Timur' },
  { code: '36', name: 'Banten' },
  { code: '51', name: 'Bali' },
  { code: '52', name: 'Nusa Tenggara Barat' },
  { code: '53', name: 'Nusa Tenggara Timur' },
  { code: '61', name: 'Kalimantan Barat' },
  { code: '62', name: 'Kalimantan Tengah' },
  { code: '63', name: 'Kalimantan Selatan' },
  { code: '64', name: 'Kalimantan Timur' },
  { code: '65', name: 'Kalimantan Utara' },
  { code: '71', name: 'Sulawesi Utara' },
  { code: '72', name: 'Sulawesi Tengah' },
  { code: '73', name: 'Sulawesi Selatan' },
  { code: '74', name: 'Sulawesi Tenggara' },
  { code: '75', name: 'Gorontalo' },
  { code: '76', name: 'Sulawesi Barat' },
  { code: '81', name: 'Maluku' },
  { code: '82', name: 'Maluku Utara' },
  { code: '91', name: 'Papua' },
  { code: '92', name: 'Papua Barat' },
  { code: '93', name: 'Papua Selatan' },
  { code: '94', name: 'Papua Tengah' },
  { code: '95', name: 'Papua Pegunungan' },
  { code: '96', name: 'Papua Barat Daya' }
];

const operators = [
  { mnc: '01', name: 'PT Indosat Ooredoo Hutchison', brand: 'Indosat/IM3', prefix: '0814,0815,0816,0855,0856,0857,0858' },
  { mnc: '10', name: 'PT Telekomunikasi Selular', brand: 'Telkomsel', prefix: '0811,0812,0813,0821,0822,0823,0851,0852,0853' },
  { mnc: '11', name: 'PT XL Axiata Tbk', brand: 'XL Axiata', prefix: '0817,0818,0819,0859,0877,0878' },
  { mnc: '89', name: 'PT Hutchison 3 Indonesia', brand: 'Tri (3)', prefix: '0895,0896,0897,0898,0899' },
  { mnc: '28', name: 'PT Telekomunikasi Indonesia', brand: 'Telkom/By.U', prefix: '0838,0831,0832,0833' },
  { mnc: '27', name: 'PT Sampoerna Telekomunikasi Indonesia', brand: 'Net1', prefix: '0868' },
  { mnc: '09', name: 'PT Smartfren Telecom', brand: 'Smartfren', prefix: '0881,0882,0883,0884,0885,0886,0887,0888,0889' }
];

const citiesData = {
  '11': [
    { code: '1101', name: 'Kab. Aceh Selatan', type: 'kabupaten', lat: 3.17, lng: 97.35 },
    { code: '1102', name: 'Kab. Aceh Tenggara', type: 'kabupaten', lat: 3.37, lng: 97.72 },
    { code: '1103', name: 'Kab. Aceh Timur', type: 'kabupaten', lat: 4.63, lng: 97.67 },
    { code: '1104', name: 'Kab. Aceh Tengah', type: 'kabupaten', lat: 4.60, lng: 96.85 },
    { code: '1105', name: 'Kab. Aceh Barat', type: 'kabupaten', lat: 4.45, lng: 96.17 },
    { code: '1106', name: 'Kab. Aceh Besar', type: 'kabupaten', lat: 5.38, lng: 95.52 },
    { code: '1107', name: 'Kab. Pidie', type: 'kabupaten', lat: 5.07, lng: 96.12 },
    { code: '1108', name: 'Kab. Aceh Utara', type: 'kabupaten', lat: 5.00, lng: 97.13 },
    { code: '1109', name: 'Kab. Simeulue', type: 'kabupaten', lat: 2.62, lng: 96.08 },
    { code: '1110', name: 'Kab. Aceh Singkil', type: 'kabupaten', lat: 2.35, lng: 97.82 },
    { code: '1111', name: 'Kab. Bireuen', type: 'kabupaten', lat: 5.07, lng: 96.70 },
    { code: '1171', name: 'Kota Banda Aceh', type: 'kota', lat: 5.55, lng: 95.32 },
    { code: '1172', name: 'Kota Sabang', type: 'kota', lat: 5.89, lng: 95.32 },
    { code: '1173', name: 'Kota Lhokseumawe', type: 'kota', lat: 5.18, lng: 97.15 },
    { code: '1174', name: 'Kota Langsa', type: 'kota', lat: 4.47, lng: 97.97 },
    { code: '1175', name: 'Kota Subulussalam', type: 'kota', lat: 2.64, lng: 98.00 }
  ],
  '12': [
    { code: '1201', name: 'Kab. Tapanuli Tengah', type: 'kabupaten', lat: 1.92, lng: 98.68 },
    { code: '1202', name: 'Kab. Tapanuli Utara', type: 'kabupaten', lat: 2.30, lng: 99.05 },
    { code: '1203', name: 'Kab. Tapanuli Selatan', type: 'kabupaten', lat: 1.50, lng: 99.27 },
    { code: '1204', name: 'Kab. Nias', type: 'kabupaten', lat: 1.10, lng: 97.57 },
    { code: '1205', name: 'Kab. Langkat', type: 'kabupaten', lat: 3.73, lng: 98.20 },
    { code: '1206', name: 'Kab. Karo', type: 'kabupaten', lat: 3.10, lng: 98.40 },
    { code: '1207', name: 'Kab. Deli Serdang', type: 'kabupaten', lat: 3.42, lng: 98.68 },
    { code: '1208', name: 'Kab. Simalungun', type: 'kabupaten', lat: 2.93, lng: 99.05 },
    { code: '1209', name: 'Kab. Asahan', type: 'kabupaten', lat: 2.87, lng: 99.65 },
    { code: '1210', name: 'Kab. Labuhanbatu', type: 'kabupaten', lat: 2.17, lng: 100.00 },
    { code: '1211', name: 'Kab. Dairi', type: 'kabupaten', lat: 2.73, lng: 98.22 },
    { code: '1212', name: 'Kab. Toba', type: 'kabupaten', lat: 2.47, lng: 99.07 },
    { code: '1271', name: 'Kota Medan', type: 'kota', lat: 3.59, lng: 98.67 },
    { code: '1272', name: 'Kota Pematang Siantar', type: 'kota', lat: 2.95, lng: 99.05 },
    { code: '1273', name: 'Kota Tebing Tinggi', type: 'kota', lat: 3.33, lng: 99.15 },
    { code: '1274', name: 'Kota Binjai', type: 'kota', lat: 3.60, lng: 98.48 },
    { code: '1275', name: 'Kota Padangsidimpuan', type: 'kota', lat: 1.38, lng: 99.27 },
    { code: '1276', name: 'Kota Sibolga', type: 'kota', lat: 1.73, lng: 98.78 }
  ],
  '13': [
    { code: '1301', name: 'Kab. Pesisir Selatan', type: 'kabupaten', lat: -1.58, lng: 100.58 },
    { code: '1302', name: 'Kab. Solok', type: 'kabupaten', lat: -0.80, lng: 100.65 },
    { code: '1303', name: 'Kab. Sijunjung', type: 'kabupaten', lat: -0.67, lng: 101.00 },
    { code: '1304', name: 'Kab. Tanah Datar', type: 'kabupaten', lat: -0.45, lng: 100.60 },
    { code: '1305', name: 'Kab. Padang Pariaman', type: 'kabupaten', lat: -0.55, lng: 100.15 },
    { code: '1306', name: 'Kab. Agam', type: 'kabupaten', lat: -0.27, lng: 100.27 },
    { code: '1307', name: 'Kab. Lima Puluh Kota', type: 'kabupaten', lat: -0.17, lng: 100.60 },
    { code: '1308', name: 'Kab. Pasaman', type: 'kabupaten', lat: 0.17, lng: 100.08 },
    { code: '1371', name: 'Kota Padang', type: 'kota', lat: -0.95, lng: 100.35 },
    { code: '1372', name: 'Kota Solok', type: 'kota', lat: -0.77, lng: 100.65 },
    { code: '1373', name: 'Kota Bukittinggi', type: 'kota', lat: -0.30, lng: 100.37 },
    { code: '1374', name: 'Kota Payakumbuh', type: 'kota', lat: -0.22, lng: 100.63 },
    { code: '1375', name: 'Kota Pariaman', type: 'kota', lat: -0.62, lng: 100.12 }
  ],
  '14': [
    { code: '1401', name: 'Kab. Kampar', type: 'kabupaten', lat: 0.38, lng: 101.10 },
    { code: '1402', name: 'Kab. Indragiri Hulu', type: 'kabupaten', lat: -0.33, lng: 102.28 },
    { code: '1403', name: 'Kab. Bengkalis', type: 'kabupaten', lat: 1.50, lng: 102.08 },
    { code: '1404', name: 'Kab. Indragiri Hilir', type: 'kabupaten', lat: -0.33, lng: 103.17 },
    { code: '1405', name: 'Kab. Pelalawan', type: 'kabupaten', lat: 0.50, lng: 102.28 },
    { code: '1406', name: 'Kab. Rokan Hulu', type: 'kabupaten', lat: 1.00, lng: 100.55 },
    { code: '1407', name: 'Kab. Rokan Hilir', type: 'kabupaten', lat: 2.00, lng: 101.33 },
    { code: '1408', name: 'Kab. Siak', type: 'kabupaten', lat: 1.23, lng: 101.97 },
    { code: '1409', name: 'Kab. Kuantan Singingi', type: 'kabupaten', lat: -0.53, lng: 101.50 },
    { code: '1471', name: 'Kota Pekanbaru', type: 'kota', lat: 0.51, lng: 101.45 },
    { code: '1472', name: 'Kota Dumai', type: 'kota', lat: 1.68, lng: 101.45 }
  ],
  '15': [
    { code: '1501', name: 'Kab. Kerinci', type: 'kabupaten', lat: -2.07, lng: 101.33 },
    { code: '1502', name: 'Kab. Merangin', type: 'kabupaten', lat: -2.08, lng: 102.13 },
    { code: '1503', name: 'Kab. Sarolangun', type: 'kabupaten', lat: -2.25, lng: 102.73 },
    { code: '1504', name: 'Kab. Batanghari', type: 'kabupaten', lat: -1.68, lng: 103.25 },
    { code: '1505', name: 'Kab. Muaro Jambi', type: 'kabupaten', lat: -1.55, lng: 103.80 },
    { code: '1506', name: 'Kab. Tanjung Jabung Barat', type: 'kabupaten', lat: -1.13, lng: 103.45 },
    { code: '1507', name: 'Kab. Tanjung Jabung Timur', type: 'kabupaten', lat: -1.08, lng: 104.17 },
    { code: '1508', name: 'Kab. Bungo', type: 'kabupaten', lat: -1.50, lng: 102.17 },
    { code: '1509', name: 'Kab. Tebo', type: 'kabupaten', lat: -1.37, lng: 102.60 },
    { code: '1571', name: 'Kota Jambi', type: 'kota', lat: -1.60, lng: 103.62 },
    { code: '1572', name: 'Kota Sungai Penuh', type: 'kota', lat: -2.07, lng: 101.38 }
  ],
  '16': [
    { code: '1601', name: 'Kab. Ogan Komering Ulu', type: 'kabupaten', lat: -3.70, lng: 104.23 },
    { code: '1602', name: 'Kab. Ogan Komering Ilir', type: 'kabupaten', lat: -3.25, lng: 105.17 },
    { code: '1603', name: 'Kab. Muara Enim', type: 'kabupaten', lat: -3.70, lng: 103.77 },
    { code: '1604', name: 'Kab. Lahat', type: 'kabupaten', lat: -3.80, lng: 103.53 },
    { code: '1605', name: 'Kab. Musi Rawas', type: 'kabupaten', lat: -3.17, lng: 103.00 },
    { code: '1606', name: 'Kab. Musi Banyuasin', type: 'kabupaten', lat: -2.73, lng: 104.13 },
    { code: '1607', name: 'Kab. Banyuasin', type: 'kabupaten', lat: -2.50, lng: 104.90 },
    { code: '1671', name: 'Kota Palembang', type: 'kota', lat: -2.99, lng: 104.76 },
    { code: '1672', name: 'Kota Prabumulih', type: 'kota', lat: -3.43, lng: 104.23 },
    { code: '1673', name: 'Kota Pagar Alam', type: 'kota', lat: -4.02, lng: 103.25 },
    { code: '1674', name: 'Kota Lubuklinggau', type: 'kota', lat: -3.30, lng: 102.87 }
  ],
  '17': [
    { code: '1701', name: 'Kab. Bengkulu Selatan', type: 'kabupaten', lat: -4.43, lng: 103.23 },
    { code: '1702', name: 'Kab. Rejang Lebong', type: 'kabupaten', lat: -3.45, lng: 102.65 },
    { code: '1703', name: 'Kab. Bengkulu Utara', type: 'kabupaten', lat: -3.33, lng: 101.87 },
    { code: '1704', name: 'Kab. Kaur', type: 'kabupaten', lat: -4.73, lng: 103.38 },
    { code: '1705', name: 'Kab. Seluma', type: 'kabupaten', lat: -4.00, lng: 102.53 },
    { code: '1706', name: 'Kab. Mukomuko', type: 'kabupaten', lat: -2.58, lng: 101.10 },
    { code: '1707', name: 'Kab. Lebong', type: 'kabupaten', lat: -3.17, lng: 102.35 },
    { code: '1708', name: 'Kab. Kepahiang', type: 'kabupaten', lat: -3.62, lng: 102.57 },
    { code: '1709', name: 'Kab. Bengkulu Tengah', type: 'kabupaten', lat: -3.70, lng: 102.23 },
    { code: '1771', name: 'Kota Bengkulu', type: 'kota', lat: -3.80, lng: 102.27 }
  ],
  '18': [
    { code: '1801', name: 'Kab. Lampung Selatan', type: 'kabupaten', lat: -5.60, lng: 105.62 },
    { code: '1802', name: 'Kab. Lampung Tengah', type: 'kabupaten', lat: -4.82, lng: 105.27 },
    { code: '1803', name: 'Kab. Lampung Utara', type: 'kabupaten', lat: -4.83, lng: 104.72 },
    { code: '1804', name: 'Kab. Lampung Barat', type: 'kabupaten', lat: -5.17, lng: 104.17 },
    { code: '1805', name: 'Kab. Tulang Bawang', type: 'kabupaten', lat: -4.37, lng: 105.42 },
    { code: '1806', name: 'Kab. Tanggamus', type: 'kabupaten', lat: -5.42, lng: 104.62 },
    { code: '1807', name: 'Kab. Lampung Timur', type: 'kabupaten', lat: -5.12, lng: 105.78 },
    { code: '1808', name: 'Kab. Way Kanan', type: 'kabupaten', lat: -4.55, lng: 104.37 },
    { code: '1809', name: 'Kab. Pesawaran', type: 'kabupaten', lat: -5.48, lng: 105.08 },
    { code: '1810', name: 'Kab. Pringsewu', type: 'kabupaten', lat: -5.37, lng: 104.98 },
    { code: '1811', name: 'Kab. Mesuji', type: 'kabupaten', lat: -3.98, lng: 105.58 },
    { code: '1812', name: 'Kab. Tulang Bawang Barat', type: 'kabupaten', lat: -4.45, lng: 105.10 },
    { code: '1813', name: 'Kab. Pesisir Barat', type: 'kabupaten', lat: -5.18, lng: 103.93 },
    { code: '1871', name: 'Kota Bandar Lampung', type: 'kota', lat: -5.43, lng: 105.27 },
    { code: '1872', name: 'Kota Metro', type: 'kota', lat: -5.12, lng: 105.30 }
  ],
  '19': [
    { code: '1901', name: 'Kab. Bangka', type: 'kabupaten', lat: -1.88, lng: 106.10 },
    { code: '1902', name: 'Kab. Belitung', type: 'kabupaten', lat: -2.85, lng: 107.92 },
    { code: '1903', name: 'Kab. Bangka Selatan', type: 'kabupaten', lat: -2.82, lng: 106.22 },
    { code: '1904', name: 'Kab. Bangka Tengah', type: 'kabupaten', lat: -2.33, lng: 106.40 },
    { code: '1905', name: 'Kab. Bangka Barat', type: 'kabupaten', lat: -2.07, lng: 105.67 },
    { code: '1906', name: 'Kab. Belitung Timur', type: 'kabupaten', lat: -2.87, lng: 108.18 },
    { code: '1971', name: 'Kota Pangkalpinang', type: 'kota', lat: -2.13, lng: 106.12 }
  ],
  '21': [
    { code: '2101', name: 'Kab. Bintan', type: 'kabupaten', lat: 1.07, lng: 104.58 },
    { code: '2102', name: 'Kab. Karimun', type: 'kabupaten', lat: 1.05, lng: 103.42 },
    { code: '2103', name: 'Kab. Natuna', type: 'kabupaten', lat: 3.82, lng: 108.38 },
    { code: '2104', name: 'Kab. Lingga', type: 'kabupaten', lat: 0.22, lng: 104.60 },
    { code: '2105', name: 'Kab. Kepulauan Anambas', type: 'kabupaten', lat: 3.22, lng: 106.25 },
    { code: '2171', name: 'Kota Batam', type: 'kota', lat: 1.05, lng: 104.03 },
    { code: '2172', name: 'Kota Tanjungpinang', type: 'kota', lat: 0.92, lng: 104.45 }
  ],
  '31': [
    { code: '3101', name: 'Kab. Kepulauan Seribu', type: 'kabupaten', lat: -5.62, lng: 106.58 },
    { code: '3171', name: 'Kota Jakarta Pusat', type: 'kota', lat: -6.19, lng: 106.83 },
    { code: '3172', name: 'Kota Jakarta Utara', type: 'kota', lat: -6.14, lng: 106.84 },
    { code: '3173', name: 'Kota Jakarta Barat', type: 'kota', lat: -6.17, lng: 106.76 },
    { code: '3174', name: 'Kota Jakarta Selatan', type: 'kota', lat: -6.26, lng: 106.81 },
    { code: '3175', name: 'Kota Jakarta Timur', type: 'kota', lat: -6.23, lng: 106.90 }
  ],
  '32': [
    { code: '3201', name: 'Kab. Bogor', type: 'kabupaten', lat: -6.65, lng: 106.82 },
    { code: '3202', name: 'Kab. Sukabumi', type: 'kabupaten', lat: -6.92, lng: 106.93 },
    { code: '3203', name: 'Kab. Cianjur', type: 'kabupaten', lat: -6.82, lng: 107.13 },
    { code: '3204', name: 'Kab. Bandung', type: 'kabupaten', lat: -6.92, lng: 107.60 },
    { code: '3205', name: 'Kab. Garut', type: 'kabupaten', lat: -7.22, lng: 107.90 },
    { code: '3206', name: 'Kab. Tasikmalaya', type: 'kabupaten', lat: -7.33, lng: 108.22 },
    { code: '3207', name: 'Kab. Ciamis', type: 'kabupaten', lat: -7.33, lng: 108.35 },
    { code: '3208', name: 'Kab. Kuningan', type: 'kabupaten', lat: -6.98, lng: 108.48 },
    { code: '3209', name: 'Kab. Cirebon', type: 'kabupaten', lat: -6.73, lng: 108.55 },
    { code: '3210', name: 'Kab. Majalengka', type: 'kabupaten', lat: -6.83, lng: 108.23 },
    { code: '3211', name: 'Kab. Sumedang', type: 'kabupaten', lat: -6.83, lng: 107.92 },
    { code: '3212', name: 'Kab. Indramayu', type: 'kabupaten', lat: -6.33, lng: 108.33 },
    { code: '3213', name: 'Kab. Subang', type: 'kabupaten', lat: -6.57, lng: 107.75 },
    { code: '3214', name: 'Kab. Purwakarta', type: 'kabupaten', lat: -6.55, lng: 107.45 },
    { code: '3215', name: 'Kab. Karawang', type: 'kabupaten', lat: -6.32, lng: 107.33 },
    { code: '3216', name: 'Kab. Bekasi', type: 'kabupaten', lat: -6.25, lng: 107.08 },
    { code: '3217', name: 'Kab. Bandung Barat', type: 'kabupaten', lat: -6.85, lng: 107.47 },
    { code: '3218', name: 'Kab. Pangandaran', type: 'kabupaten', lat: -7.68, lng: 108.65 },
    { code: '3271', name: 'Kota Bogor', type: 'kota', lat: -6.60, lng: 106.80 },
    { code: '3272', name: 'Kota Sukabumi', type: 'kota', lat: -6.92, lng: 106.93 },
    { code: '3273', name: 'Kota Bandung', type: 'kota', lat: -6.92, lng: 107.60 },
    { code: '3274', name: 'Kota Cirebon', type: 'kota', lat: -6.73, lng: 108.55 },
    { code: '3275', name: 'Kota Bekasi', type: 'kota', lat: -6.24, lng: 106.99 },
    { code: '3276', name: 'Kota Depok', type: 'kota', lat: -6.40, lng: 106.82 },
    { code: '3277', name: 'Kota Cimahi', type: 'kota', lat: -6.88, lng: 107.53 },
    { code: '3278', name: 'Kota Tasikmalaya', type: 'kota', lat: -7.33, lng: 108.22 },
    { code: '3279', name: 'Kota Banjar', type: 'kota', lat: -7.37, lng: 108.53 }
  ],
  '33': [
    { code: '3301', name: 'Kab. Cilacap', type: 'kabupaten', lat: -7.72, lng: 109.00 },
    { code: '3302', name: 'Kab. Banyumas', type: 'kabupaten', lat: -7.43, lng: 109.23 },
    { code: '3303', name: 'Kab. Purbalingga', type: 'kabupaten', lat: -7.38, lng: 109.37 },
    { code: '3304', name: 'Kab. Banjarnegara', type: 'kabupaten', lat: -7.38, lng: 109.68 },
    { code: '3305', name: 'Kab. Kebumen', type: 'kabupaten', lat: -7.67, lng: 109.65 },
    { code: '3306', name: 'Kab. Purworejo', type: 'kabupaten', lat: -7.72, lng: 110.00 },
    { code: '3307', name: 'Kab. Wonosobo', type: 'kabupaten', lat: -7.37, lng: 109.92 },
    { code: '3308', name: 'Kab. Magelang', type: 'kabupaten', lat: -7.47, lng: 110.22 },
    { code: '3309', name: 'Kab. Boyolali', type: 'kabupaten', lat: -7.53, lng: 110.60 },
    { code: '3310', name: 'Kab. Klaten', type: 'kabupaten', lat: -7.70, lng: 110.60 },
    { code: '3311', name: 'Kab. Sukoharjo', type: 'kabupaten', lat: -7.68, lng: 110.83 },
    { code: '3312', name: 'Kab. Wonogiri', type: 'kabupaten', lat: -7.82, lng: 110.92 },
    { code: '3313', name: 'Kab. Karanganyar', type: 'kabupaten', lat: -7.60, lng: 110.95 },
    { code: '3314', name: 'Kab. Sragen', type: 'kabupaten', lat: -7.43, lng: 111.02 },
    { code: '3315', name: 'Kab. Grobogan', type: 'kabupaten', lat: -7.08, lng: 110.90 },
    { code: '3316', name: 'Kab. Blora', type: 'kabupaten', lat: -6.97, lng: 111.42 },
    { code: '3317', name: 'Kab. Rembang', type: 'kabupaten', lat: -6.72, lng: 111.35 },
    { code: '3318', name: 'Kab. Pati', type: 'kabupaten', lat: -6.75, lng: 111.03 },
    { code: '3319', name: 'Kab. Kudus', type: 'kabupaten', lat: -6.80, lng: 110.85 },
    { code: '3320', name: 'Kab. Jepara', type: 'kabupaten', lat: -6.58, lng: 110.67 },
    { code: '3321', name: 'Kab. Demak', type: 'kabupaten', lat: -6.90, lng: 110.63 },
    { code: '3322', name: 'Kab. Semarang', type: 'kabupaten', lat: -7.22, lng: 110.42 },
    { code: '3323', name: 'Kab. Temanggung', type: 'kabupaten', lat: -7.32, lng: 110.17 },
    { code: '3324', name: 'Kab. Kendal', type: 'kabupaten', lat: -7.03, lng: 110.18 },
    { code: '3325', name: 'Kab. Batang', type: 'kabupaten', lat: -7.00, lng: 109.72 },
    { code: '3326', name: 'Kab. Pekalongan', type: 'kabupaten', lat: -7.08, lng: 109.60 },
    { code: '3327', name: 'Kab. Pemalang', type: 'kabupaten', lat: -6.88, lng: 109.38 },
    { code: '3328', name: 'Kab. Tegal', type: 'kabupaten', lat: -7.03, lng: 109.12 },
    { code: '3329', name: 'Kab. Brebes', type: 'kabupaten', lat: -6.87, lng: 109.05 },
    { code: '3371', name: 'Kota Magelang', type: 'kota', lat: -7.47, lng: 110.22 },
    { code: '3372', name: 'Kota Surakarta', type: 'kota', lat: -7.57, lng: 110.82 },
    { code: '3373', name: 'Kota Salatiga', type: 'kota', lat: -7.33, lng: 110.50 },
    { code: '3374', name: 'Kota Semarang', type: 'kota', lat: -6.97, lng: 110.42 },
    { code: '3375', name: 'Kota Pekalongan', type: 'kota', lat: -6.88, lng: 109.67 },
    { code: '3376', name: 'Kota Tegal', type: 'kota', lat: -6.87, lng: 109.15 }
  ],
  '34': [
    { code: '3401', name: 'Kab. Kulon Progo', type: 'kabupaten', lat: -7.83, lng: 110.17 },
    { code: '3402', name: 'Kab. Bantul', type: 'kabupaten', lat: -7.88, lng: 110.33 },
    { code: '3403', name: 'Kab. Gunungkidul', type: 'kabupaten', lat: -7.98, lng: 110.60 },
    { code: '3404', name: 'Kab. Sleman', type: 'kabupaten', lat: -7.72, lng: 110.35 },
    { code: '3471', name: 'Kota Yogyakarta', type: 'kota', lat: -7.80, lng: 110.37 }
  ],
  '35': [
    { code: '3501', name: 'Kab. Pacitan', type: 'kabupaten', lat: -8.20, lng: 111.10 },
    { code: '3502', name: 'Kab. Ponorogo', type: 'kabupaten', lat: -7.87, lng: 111.47 },
    { code: '3503', name: 'Kab. Trenggalek', type: 'kabupaten', lat: -8.07, lng: 111.72 },
    { code: '3504', name: 'Kab. Tulungagung', type: 'kabupaten', lat: -8.07, lng: 111.90 },
    { code: '3505', name: 'Kab. Blitar', type: 'kabupaten', lat: -8.07, lng: 112.17 },
    { code: '3506', name: 'Kab. Kediri', type: 'kabupaten', lat: -7.82, lng: 112.02 },
    { code: '3507', name: 'Kab. Malang', type: 'kabupaten', lat: -8.05, lng: 112.67 },
    { code: '3508', name: 'Kab. Lumajang', type: 'kabupaten', lat: -8.13, lng: 113.23 },
    { code: '3509', name: 'Kab. Jember', type: 'kabupaten', lat: -8.17, lng: 113.70 },
    { code: '3510', name: 'Kab. Banyuwangi', type: 'kabupaten', lat: -8.22, lng: 114.35 },
    { code: '3511', name: 'Kab. Bondowoso', type: 'kabupaten', lat: -7.92, lng: 113.82 },
    { code: '3512', name: 'Kab. Situbondo', type: 'kabupaten', lat: -7.72, lng: 114.00 },
    { code: '3513', name: 'Kab. Probolinggo', type: 'kabupaten', lat: -7.83, lng: 113.28 },
    { code: '3514', name: 'Kab. Pasuruan', type: 'kabupaten', lat: -7.72, lng: 112.85 },
    { code: '3515', name: 'Kab. Sidoarjo', type: 'kabupaten', lat: -7.45, lng: 112.72 },
    { code: '3516', name: 'Kab. Mojokerto', type: 'kabupaten', lat: -7.47, lng: 112.42 },
    { code: '3517', name: 'Kab. Jombang', type: 'kabupaten', lat: -7.55, lng: 112.23 },
    { code: '3518', name: 'Kab. Nganjuk', type: 'kabupaten', lat: -7.60, lng: 111.90 },
    { code: '3519', name: 'Kab. Madiun', type: 'kabupaten', lat: -7.63, lng: 111.52 },
    { code: '3520', name: 'Kab. Magetan', type: 'kabupaten', lat: -7.65, lng: 111.35 },
    { code: '3521', name: 'Kab. Ngawi', type: 'kabupaten', lat: -7.42, lng: 111.45 },
    { code: '3522', name: 'Kab. Bojonegoro', type: 'kabupaten', lat: -7.17, lng: 111.88 },
    { code: '3523', name: 'Kab. Tuban', type: 'kabupaten', lat: -6.90, lng: 112.05 },
    { code: '3524', name: 'Kab. Lamongan', type: 'kabupaten', lat: -7.12, lng: 112.42 },
    { code: '3525', name: 'Kab. Gresik', type: 'kabupaten', lat: -7.17, lng: 112.65 },
    { code: '3526', name: 'Kab. Bangkalan', type: 'kabupaten', lat: -7.05, lng: 112.93 },
    { code: '3527', name: 'Kab. Sampang', type: 'kabupaten', lat: -7.05, lng: 113.25 },
    { code: '3528', name: 'Kab. Pamekasan', type: 'kabupaten', lat: -7.15, lng: 113.48 },
    { code: '3529', name: 'Kab. Sumenep', type: 'kabupaten', lat: -7.00, lng: 113.87 },
    { code: '3571', name: 'Kota Kediri', type: 'kota', lat: -7.82, lng: 112.02 },
    { code: '3572', name: 'Kota Blitar', type: 'kota', lat: -8.10, lng: 112.17 },
    { code: '3573', name: 'Kota Malang', type: 'kota', lat: -7.98, lng: 112.63 },
    { code: '3574', name: 'Kota Probolinggo', type: 'kota', lat: -7.75, lng: 113.22 },
    { code: '3575', name: 'Kota Pasuruan', type: 'kota', lat: -7.65, lng: 112.90 },
    { code: '3576', name: 'Kota Mojokerto', type: 'kota', lat: -7.47, lng: 112.43 },
    { code: '3577', name: 'Kota Madiun', type: 'kota', lat: -7.63, lng: 111.52 },
    { code: '3578', name: 'Kota Surabaya', type: 'kota', lat: -7.25, lng: 112.75 },
    { code: '3579', name: 'Kota Batu', type: 'kota', lat: -7.87, lng: 112.53 }
  ],
  '36': [
    { code: '3601', name: 'Kab. Pandeglang', type: 'kabupaten', lat: -6.68, lng: 105.97 },
    { code: '3602', name: 'Kab. Lebak', type: 'kabupaten', lat: -6.57, lng: 106.25 },
    { code: '3603', name: 'Kab. Tangerang', type: 'kabupaten', lat: -6.28, lng: 106.53 },
    { code: '3604', name: 'Kab. Serang', type: 'kabupaten', lat: -6.12, lng: 106.15 },
    { code: '3671', name: 'Kota Tangerang', type: 'kota', lat: -6.18, lng: 106.63 },
    { code: '3672', name: 'Kota Cilegon', type: 'kota', lat: -6.02, lng: 106.05 },
    { code: '3673', name: 'Kota Serang', type: 'kota', lat: -6.12, lng: 106.15 },
    { code: '3674', name: 'Kota Tangerang Selatan', type: 'kota', lat: -6.33, lng: 106.68 }
  ],
  '51': [
    { code: '5101', name: 'Kab. Jembrana', type: 'kabupaten', lat: -8.35, lng: 114.55 },
    { code: '5102', name: 'Kab. Tabanan', type: 'kabupaten', lat: -8.53, lng: 115.12 },
    { code: '5103', name: 'Kab. Badung', type: 'kabupaten', lat: -8.58, lng: 115.18 },
    { code: '5104', name: 'Kab. Gianyar', type: 'kabupaten', lat: -8.53, lng: 115.32 },
    { code: '5105', name: 'Kab. Klungkung', type: 'kabupaten', lat: -8.53, lng: 115.40 },
    { code: '5106', name: 'Kab. Bangli', type: 'kabupaten', lat: -8.45, lng: 115.35 },
    { code: '5107', name: 'Kab. Karangasem', type: 'kabupaten', lat: -8.45, lng: 115.60 },
    { code: '5108', name: 'Kab. Buleleng', type: 'kabupaten', lat: -8.22, lng: 115.10 },
    { code: '5171', name: 'Kota Denpasar', type: 'kota', lat: -8.65, lng: 115.22 }
  ],
  '52': [
    { code: '5201', name: 'Kab. Lombok Barat', type: 'kabupaten', lat: -8.65, lng: 116.08 },
    { code: '5202', name: 'Kab. Lombok Tengah', type: 'kabupaten', lat: -8.72, lng: 116.27 },
    { code: '5203', name: 'Kab. Lombok Timur', type: 'kabupaten', lat: -8.55, lng: 116.53 },
    { code: '5204', name: 'Kab. Sumbawa', type: 'kabupaten', lat: -8.70, lng: 117.42 },
    { code: '5205', name: 'Kab. Dompu', type: 'kabupaten', lat: -8.55, lng: 118.47 },
    { code: '5206', name: 'Kab. Bima', type: 'kabupaten', lat: -8.60, lng: 118.72 },
    { code: '5207', name: 'Kab. Sumbawa Barat', type: 'kabupaten', lat: -8.78, lng: 116.88 },
    { code: '5208', name: 'Kab. Lombok Utara', type: 'kabupaten', lat: -8.35, lng: 116.35 },
    { code: '5271', name: 'Kota Mataram', type: 'kota', lat: -8.58, lng: 116.10 },
    { code: '5272', name: 'Kota Bima', type: 'kota', lat: -8.47, lng: 118.72 }
  ],
  '53': [
    { code: '5301', name: 'Kab. Kupang', type: 'kabupaten', lat: -10.17, lng: 123.60 },
    { code: '5302', name: 'Kab. Timor Tengah Selatan', type: 'kabupaten', lat: -9.73, lng: 124.33 },
    { code: '5303', name: 'Kab. Timor Tengah Utara', type: 'kabupaten', lat: -9.58, lng: 124.58 },
    { code: '5304', name: 'Kab. Belu', type: 'kabupaten', lat: -9.22, lng: 124.95 },
    { code: '5305', name: 'Kab. Alor', type: 'kabupaten', lat: -8.25, lng: 124.73 },
    { code: '5306', name: 'Kab. Flores Timur', type: 'kabupaten', lat: -8.37, lng: 122.98 },
    { code: '5307', name: 'Kab. Sikka', type: 'kabupaten', lat: -8.65, lng: 122.17 },
    { code: '5308', name: 'Kab. Ende', type: 'kabupaten', lat: -8.85, lng: 121.67 },
    { code: '5309', name: 'Kab. Ngada', type: 'kabupaten', lat: -8.72, lng: 121.07 },
    { code: '5310', name: 'Kab. Manggarai', type: 'kabupaten', lat: -8.62, lng: 120.42 },
    { code: '5311', name: 'Kab. Sumba Timur', type: 'kabupaten', lat: -9.65, lng: 120.25 },
    { code: '5312', name: 'Kab. Sumba Barat', type: 'kabupaten', lat: -9.62, lng: 119.42 },
    { code: '5371', name: 'Kota Kupang', type: 'kota', lat: -10.18, lng: 123.58 }
  ],
  '61': [
    { code: '6101', name: 'Kab. Sambas', type: 'kabupaten', lat: 1.37, lng: 109.30 },
    { code: '6102', name: 'Kab. Mempawah', type: 'kabupaten', lat: 0.38, lng: 109.10 },
    { code: '6103', name: 'Kab. Sanggau', type: 'kabupaten', lat: 0.13, lng: 110.58 },
    { code: '6104', name: 'Kab. Ketapang', type: 'kabupaten', lat: -1.83, lng: 110.00 },
    { code: '6105', name: 'Kab. Sintang', type: 'kabupaten', lat: 0.08, lng: 111.50 },
    { code: '6106', name: 'Kab. Kapuas Hulu', type: 'kabupaten', lat: 0.83, lng: 112.93 },
    { code: '6107', name: 'Kab. Bengkayang', type: 'kabupaten', lat: 0.82, lng: 109.48 },
    { code: '6108', name: 'Kab. Landak', type: 'kabupaten', lat: 0.35, lng: 109.97 },
    { code: '6109', name: 'Kab. Sekadau', type: 'kabupaten', lat: 0.03, lng: 110.98 },
    { code: '6110', name: 'Kab. Melawi', type: 'kabupaten', lat: -0.33, lng: 111.70 },
    { code: '6111', name: 'Kab. Kayong Utara', type: 'kabupaten', lat: -1.22, lng: 109.97 },
    { code: '6112', name: 'Kab. Kubu Raya', type: 'kabupaten', lat: -0.17, lng: 109.48 },
    { code: '6171', name: 'Kota Pontianak', type: 'kota', lat: -0.03, lng: 109.33 },
    { code: '6172', name: 'Kota Singkawang', type: 'kota', lat: 0.90, lng: 108.98 }
  ],
  '62': [
    { code: '6201', name: 'Kab. Kotawaringin Barat', type: 'kabupaten', lat: -2.68, lng: 111.63 },
    { code: '6202', name: 'Kab. Kotawaringin Timur', type: 'kabupaten', lat: -2.00, lng: 112.97 },
    { code: '6203', name: 'Kab. Kapuas', type: 'kabupaten', lat: -2.30, lng: 114.38 },
    { code: '6204', name: 'Kab. Barito Selatan', type: 'kabupaten', lat: -2.02, lng: 115.00 },
    { code: '6205', name: 'Kab. Barito Utara', type: 'kabupaten', lat: -1.18, lng: 115.30 },
    { code: '6206', name: 'Kab. Katingan', type: 'kabupaten', lat: -1.77, lng: 113.42 },
    { code: '6207', name: 'Kab. Seruyan', type: 'kabupaten', lat: -2.72, lng: 112.42 },
    { code: '6208', name: 'Kab. Sukamara', type: 'kabupaten', lat: -2.85, lng: 111.20 },
    { code: '6209', name: 'Kab. Lamandau', type: 'kabupaten', lat: -2.17, lng: 111.32 },
    { code: '6210', name: 'Kab. Gunung Mas', type: 'kabupaten', lat: -1.12, lng: 113.82 },
    { code: '6211', name: 'Kab. Pulang Pisau', type: 'kabupaten', lat: -2.38, lng: 114.17 },
    { code: '6212', name: 'Kab. Murung Raya', type: 'kabupaten', lat: -0.50, lng: 114.85 },
    { code: '6213', name: 'Kab. Barito Timur', type: 'kabupaten', lat: -1.75, lng: 115.43 },
    { code: '6271', name: 'Kota Palangka Raya', type: 'kota', lat: -2.22, lng: 113.92 }
  ],
  '63': [
    { code: '6301', name: 'Kab. Tanah Laut', type: 'kabupaten', lat: -3.77, lng: 115.08 },
    { code: '6302', name: 'Kab. Kotabaru', type: 'kabupaten', lat: -3.28, lng: 116.17 },
    { code: '6303', name: 'Kab. Banjar', type: 'kabupaten', lat: -3.43, lng: 115.07 },
    { code: '6304', name: 'Kab. Barito Kuala', type: 'kabupaten', lat: -3.12, lng: 114.80 },
    { code: '6305', name: 'Kab. Tapin', type: 'kabupaten', lat: -3.17, lng: 115.17 },
    { code: '6306', name: 'Kab. Hulu Sungai Selatan', type: 'kabupaten', lat: -2.82, lng: 115.35 },
    { code: '6307', name: 'Kab. Hulu Sungai Tengah', type: 'kabupaten', lat: -2.60, lng: 115.47 },
    { code: '6308', name: 'Kab. Hulu Sungai Utara', type: 'kabupaten', lat: -2.47, lng: 115.22 },
    { code: '6309', name: 'Kab. Tabalong', type: 'kabupaten', lat: -2.07, lng: 115.70 },
    { code: '6310', name: 'Kab. Tanah Bumbu', type: 'kabupaten', lat: -3.57, lng: 115.72 },
    { code: '6311', name: 'Kab. Balangan', type: 'kabupaten', lat: -2.33, lng: 115.60 },
    { code: '6371', name: 'Kota Banjarmasin', type: 'kota', lat: -3.32, lng: 114.58 },
    { code: '6372', name: 'Kota Banjarbaru', type: 'kota', lat: -3.45, lng: 114.83 }
  ],
  '64': [
    { code: '6401', name: 'Kab. Paser', type: 'kabupaten', lat: -1.88, lng: 116.08 },
    { code: '6402', name: 'Kab. Kutai Kartanegara', type: 'kabupaten', lat: -0.50, lng: 116.98 },
    { code: '6403', name: 'Kab. Berau', type: 'kabupaten', lat: 2.00, lng: 117.38 },
    { code: '6404', name: 'Kab. Kutai Barat', type: 'kabupaten', lat: 0.12, lng: 115.75 },
    { code: '6405', name: 'Kab. Kutai Timur', type: 'kabupaten', lat: 1.00, lng: 117.50 },
    { code: '6406', name: 'Kab. Penajam Paser Utara', type: 'kabupaten', lat: -1.28, lng: 116.67 },
    { code: '6407', name: 'Kab. Mahakam Ulu', type: 'kabupaten', lat: 0.62, lng: 115.27 },
    { code: '6471', name: 'Kota Balikpapan', type: 'kota', lat: -1.27, lng: 116.83 },
    { code: '6472', name: 'Kota Samarinda', type: 'kota', lat: -0.50, lng: 117.15 },
    { code: '6474', name: 'Kota Bontang', type: 'kota', lat: 0.13, lng: 117.50 }
  ],
  '65': [
    { code: '6501', name: 'Kab. Bulungan', type: 'kabupaten', lat: 2.83, lng: 117.25 },
    { code: '6502', name: 'Kab. Malinau', type: 'kabupaten', lat: 3.42, lng: 116.42 },
    { code: '6503', name: 'Kab. Nunukan', type: 'kabupaten', lat: 3.97, lng: 117.67 },
    { code: '6504', name: 'Kab. Tana Tidung', type: 'kabupaten', lat: 3.33, lng: 117.33 },
    { code: '6571', name: 'Kota Tarakan', type: 'kota', lat: 3.30, lng: 117.63 }
  ],
  '71': [
    { code: '7101', name: 'Kab. Bolaang Mongondow', type: 'kabupaten', lat: 0.72, lng: 124.13 },
    { code: '7102', name: 'Kab. Minahasa', type: 'kabupaten', lat: 1.17, lng: 124.88 },
    { code: '7103', name: 'Kab. Kepulauan Sangihe', type: 'kabupaten', lat: 3.52, lng: 125.55 },
    { code: '7104', name: 'Kab. Kepulauan Talaud', type: 'kabupaten', lat: 4.08, lng: 126.82 },
    { code: '7105', name: 'Kab. Minahasa Selatan', type: 'kabupaten', lat: 1.08, lng: 124.52 },
    { code: '7106', name: 'Kab. Minahasa Utara', type: 'kabupaten', lat: 1.47, lng: 125.02 },
    { code: '7107', name: 'Kab. Minahasa Tenggara', type: 'kabupaten', lat: 0.97, lng: 124.75 },
    { code: '7108', name: 'Kab. Bolaang Mongondow Utara', type: 'kabupaten', lat: 0.82, lng: 123.90 },
    { code: '7109', name: 'Kab. Kepulauan Siau Tagulandang Biaro', type: 'kabupaten', lat: 2.72, lng: 125.40 },
    { code: '7110', name: 'Kab. Bolaang Mongondow Timur', type: 'kabupaten', lat: 0.72, lng: 124.45 },
    { code: '7111', name: 'Kab. Bolaang Mongondow Selatan', type: 'kabupaten', lat: 0.48, lng: 124.08 },
    { code: '7171', name: 'Kota Manado', type: 'kota', lat: 1.47, lng: 124.85 },
    { code: '7172', name: 'Kota Bitung', type: 'kota', lat: 1.45, lng: 125.18 },
    { code: '7173', name: 'Kota Tomohon', type: 'kota', lat: 1.32, lng: 124.83 },
    { code: '7174', name: 'Kota Kotamobagu', type: 'kota', lat: 0.73, lng: 124.32 }
  ],
  '72': [
    { code: '7201', name: 'Kab. Banggai', type: 'kabupaten', lat: -1.47, lng: 123.08 },
    { code: '7202', name: 'Kab. Poso', type: 'kabupaten', lat: -1.38, lng: 121.30 },
    { code: '7203', name: 'Kab. Donggala', type: 'kabupaten', lat: -0.68, lng: 119.83 },
    { code: '7204', name: 'Kab. Tolitoli', type: 'kabupaten', lat: 1.05, lng: 120.82 },
    { code: '7205', name: 'Kab. Buol', type: 'kabupaten', lat: 1.17, lng: 121.43 },
    { code: '7206', name: 'Kab. Morowali', type: 'kabupaten', lat: -2.42, lng: 121.95 },
    { code: '7207', name: 'Kab. Banggai Kepulauan', type: 'kabupaten', lat: -1.72, lng: 123.50 },
    { code: '7208', name: 'Kab. Parigi Moutong', type: 'kabupaten', lat: -0.37, lng: 120.22 },
    { code: '7209', name: 'Kab. Tojo Una-Una', type: 'kabupaten', lat: -1.13, lng: 122.05 },
    { code: '7210', name: 'Kab. Sigi', type: 'kabupaten', lat: -1.23, lng: 119.93 },
    { code: '7211', name: 'Kab. Banggai Laut', type: 'kabupaten', lat: -1.82, lng: 123.37 },
    { code: '7212', name: 'Kab. Morowali Utara', type: 'kabupaten', lat: -1.82, lng: 121.57 },
    { code: '7271', name: 'Kota Palu', type: 'kota', lat: -0.90, lng: 119.87 }
  ],
  '73': [
    { code: '7301', name: 'Kab. Kepulauan Selayar', type: 'kabupaten', lat: -6.25, lng: 120.48 },
    { code: '7302', name: 'Kab. Bulukumba', type: 'kabupaten', lat: -5.55, lng: 120.18 },
    { code: '7303', name: 'Kab. Bantaeng', type: 'kabupaten', lat: -5.55, lng: 119.95 },
    { code: '7304', name: 'Kab. Jeneponto', type: 'kabupaten', lat: -5.65, lng: 119.72 },
    { code: '7305', name: 'Kab. Takalar', type: 'kabupaten', lat: -5.52, lng: 119.47 },
    { code: '7306', name: 'Kab. Gowa', type: 'kabupaten', lat: -5.30, lng: 119.73 },
    { code: '7307', name: 'Kab. Sinjai', type: 'kabupaten', lat: -5.22, lng: 120.22 },
    { code: '7308', name: 'Kab. Bone', type: 'kabupaten', lat: -4.55, lng: 120.22 },
    { code: '7309', name: 'Kab. Maros', type: 'kabupaten', lat: -5.00, lng: 119.58 },
    { code: '7310', name: 'Kab. Pangkajene Kepulauan', type: 'kabupaten', lat: -4.83, lng: 119.50 },
    { code: '7311', name: 'Kab. Barru', type: 'kabupaten', lat: -4.42, lng: 119.63 },
    { code: '7312', name: 'Kab. Soppeng', type: 'kabupaten', lat: -4.33, lng: 120.08 },
    { code: '7313', name: 'Kab. Wajo', type: 'kabupaten', lat: -3.95, lng: 120.33 },
    { code: '7314', name: 'Kab. Sidenreng Rappang', type: 'kabupaten', lat: -3.95, lng: 119.88 },
    { code: '7315', name: 'Kab. Pinrang', type: 'kabupaten', lat: -3.72, lng: 119.65 },
    { code: '7316', name: 'Kab. Enrekang', type: 'kabupaten', lat: -3.55, lng: 119.82 },
    { code: '7317', name: 'Kab. Luwu', type: 'kabupaten', lat: -3.20, lng: 120.30 },
    { code: '7318', name: 'Kab. Tana Toraja', type: 'kabupaten', lat: -3.08, lng: 119.88 },
    { code: '7319', name: 'Kab. Luwu Utara', type: 'kabupaten', lat: -2.55, lng: 120.33 },
    { code: '7320', name: 'Kab. Luwu Timur', type: 'kabupaten', lat: -2.48, lng: 121.17 },
    { code: '7321', name: 'Kab. Toraja Utara', type: 'kabupaten', lat: -2.95, lng: 119.92 },
    { code: '7371', name: 'Kota Makassar', type: 'kota', lat: -5.14, lng: 119.42 },
    { code: '7372', name: 'Kota Pare-Pare', type: 'kota', lat: -4.02, lng: 119.63 },
    { code: '7373', name: 'Kota Palopo', type: 'kota', lat: -2.98, lng: 120.20 }
  ],
  '74': [
    { code: '7401', name: 'Kab. Kolaka', type: 'kabupaten', lat: -3.97, lng: 121.58 },
    { code: '7402', name: 'Kab. Konawe', type: 'kabupaten', lat: -3.55, lng: 122.08 },
    { code: '7403', name: 'Kab. Muna', type: 'kabupaten', lat: -4.85, lng: 122.58 },
    { code: '7404', name: 'Kab. Buton', type: 'kabupaten', lat: -5.30, lng: 122.97 },
    { code: '7405', name: 'Kab. Konawe Selatan', type: 'kabupaten', lat: -4.08, lng: 122.42 },
    { code: '7406', name: 'Kab. Bombana', type: 'kabupaten', lat: -4.62, lng: 121.88 },
    { code: '7407', name: 'Kab. Wakatobi', type: 'kabupaten', lat: -5.32, lng: 123.58 },
    { code: '7408', name: 'Kab. Kolaka Utara', type: 'kabupaten', lat: -3.12, lng: 121.35 },
    { code: '7409', name: 'Kab. Konawe Utara', type: 'kabupaten', lat: -3.17, lng: 122.18 },
    { code: '7410', name: 'Kab. Buton Utara', type: 'kabupaten', lat: -4.77, lng: 122.83 },
    { code: '7411', name: 'Kab. Kolaka Timur', type: 'kabupaten', lat: -3.68, lng: 121.82 },
    { code: '7412', name: 'Kab. Konawe Kepulauan', type: 'kabupaten', lat: -3.82, lng: 123.08 },
    { code: '7413', name: 'Kab. Muna Barat', type: 'kabupaten', lat: -4.92, lng: 122.32 },
    { code: '7414', name: 'Kab. Buton Tengah', type: 'kabupaten', lat: -5.33, lng: 122.72 },
    { code: '7415', name: 'Kab. Buton Selatan', type: 'kabupaten', lat: -5.58, lng: 122.72 },
    { code: '7471', name: 'Kota Kendari', type: 'kota', lat: -3.97, lng: 122.52 },
    { code: '7472', name: 'Kota Baubau', type: 'kota', lat: -5.47, lng: 122.63 }
  ],
  '75': [
    { code: '7501', name: 'Kab. Gorontalo', type: 'kabupaten', lat: 0.55, lng: 122.78 },
    { code: '7502', name: 'Kab. Boalemo', type: 'kabupaten', lat: 0.53, lng: 122.28 },
    { code: '7503', name: 'Kab. Bone Bolango', type: 'kabupaten', lat: 0.50, lng: 123.23 },
    { code: '7504', name: 'Kab. Pohuwato', type: 'kabupaten', lat: 0.65, lng: 121.50 },
    { code: '7505', name: 'Kab. Gorontalo Utara', type: 'kabupaten', lat: 0.83, lng: 122.55 },
    { code: '7571', name: 'Kota Gorontalo', type: 'kota', lat: 0.53, lng: 123.07 }
  ],
  '76': [
    { code: '7601', name: 'Kab. Mamuju', type: 'kabupaten', lat: -2.68, lng: 118.89 },
    { code: '7602', name: 'Kab. Polewali Mandar', type: 'kabupaten', lat: -3.42, lng: 119.33 },
    { code: '7603', name: 'Kab. Mamasa', type: 'kabupaten', lat: -3.12, lng: 119.35 },
    { code: '7604', name: 'Kab. Majene', type: 'kabupaten', lat: -3.52, lng: 118.97 },
    { code: '7605', name: 'Kab. Mamuju Tengah', type: 'kabupaten', lat: -2.25, lng: 119.10 },
    { code: '7606', name: 'Kab. Pasangkayu', type: 'kabupaten', lat: -1.55, lng: 119.35 }
  ],
  '81': [
    { code: '8101', name: 'Kab. Maluku Tengah', type: 'kabupaten', lat: -3.35, lng: 128.17 },
    { code: '8102', name: 'Kab. Maluku Tenggara', type: 'kabupaten', lat: -5.63, lng: 132.73 },
    { code: '8103', name: 'Kab. Kepulauan Tanimbar', type: 'kabupaten', lat: -7.72, lng: 131.17 },
    { code: '8104', name: 'Kab. Buru', type: 'kabupaten', lat: -3.38, lng: 126.62 },
    { code: '8105', name: 'Kab. Seram Bagian Barat', type: 'kabupaten', lat: -2.97, lng: 128.75 },
    { code: '8106', name: 'Kab. Seram Bagian Timur', type: 'kabupaten', lat: -3.22, lng: 130.72 },
    { code: '8107', name: 'Kab. Kepulauan Aru', type: 'kabupaten', lat: -6.12, lng: 134.58 },
    { code: '8108', name: 'Kab. Maluku Barat Daya', type: 'kabupaten', lat: -7.60, lng: 127.57 },
    { code: '8109', name: 'Kab. Buru Selatan', type: 'kabupaten', lat: -3.58, lng: 126.53 },
    { code: '8171', name: 'Kota Ambon', type: 'kota', lat: -3.70, lng: 128.18 },
    { code: '8172', name: 'Kota Tual', type: 'kota', lat: -5.63, lng: 132.75 }
  ],
  '82': [
    { code: '8201', name: 'Kab. Halmahera Barat', type: 'kabupaten', lat: 1.17, lng: 127.42 },
    { code: '8202', name: 'Kab. Halmahera Tengah', type: 'kabupaten', lat: 0.52, lng: 127.98 },
    { code: '8203', name: 'Kab. Halmahera Utara', type: 'kabupaten', lat: 1.78, lng: 127.92 },
    { code: '8204', name: 'Kab. Halmahera Selatan', type: 'kabupaten', lat: -0.08, lng: 127.68 },
    { code: '8205', name: 'Kab. Kepulauan Sula', type: 'kabupaten', lat: -1.85, lng: 125.98 },
    { code: '8206', name: 'Kab. Halmahera Timur', type: 'kabupaten', lat: 1.18, lng: 128.28 },
    { code: '8207', name: 'Kab. Pulau Morotai', type: 'kabupaten', lat: 2.32, lng: 128.43 },
    { code: '8208', name: 'Kab. Pulau Taliabu', type: 'kabupaten', lat: -1.88, lng: 124.78 },
    { code: '8271', name: 'Kota Ternate', type: 'kota', lat: 0.78, lng: 127.38 },
    { code: '8272', name: 'Kota Tidore Kepulauan', type: 'kota', lat: 0.68, lng: 127.40 }
  ],
  '91': [
    { code: '9101', name: 'Kab. Merauke', type: 'kabupaten', lat: -7.50, lng: 140.33 },
    { code: '9102', name: 'Kab. Jayawijaya', type: 'kabupaten', lat: -4.10, lng: 139.00 },
    { code: '9103', name: 'Kab. Jayapura', type: 'kabupaten', lat: -2.90, lng: 140.58 },
    { code: '9104', name: 'Kab. Nabire', type: 'kabupaten', lat: -3.38, lng: 135.58 },
    { code: '9105', name: 'Kab. Kepulauan Yapen', type: 'kabupaten', lat: -1.82, lng: 136.38 },
    { code: '9106', name: 'Kab. Biak Numfor', type: 'kabupaten', lat: -1.17, lng: 136.08 },
    { code: '9107', name: 'Kab. Puncak Jaya', type: 'kabupaten', lat: -3.83, lng: 137.48 },
    { code: '9108', name: 'Kab. Sarmi', type: 'kabupaten', lat: -2.13, lng: 138.82 },
    { code: '9109', name: 'Kab. Keerom', type: 'kabupaten', lat: -3.00, lng: 140.80 },
    { code: '9110', name: 'Kab. Waropen', type: 'kabupaten', lat: -2.65, lng: 137.17 },
    { code: '9111', name: 'Kab. Supiori', type: 'kabupaten', lat: -0.82, lng: 135.67 },
    { code: '9112', name: 'Kab. Mamberamo Raya', type: 'kabupaten', lat: -2.58, lng: 139.02 },
    { code: '9171', name: 'Kota Jayapura', type: 'kota', lat: -2.53, lng: 140.72 }
  ],
  '92': [
    { code: '9201', name: 'Kab. Manokwari', type: 'kabupaten', lat: -0.87, lng: 134.08 },
    { code: '9202', name: 'Kab. Fak-Fak', type: 'kabupaten', lat: -2.93, lng: 132.30 },
    { code: '9203', name: 'Kab. Sorong', type: 'kabupaten', lat: -1.25, lng: 131.42 },
    { code: '9204', name: 'Kab. Raja Ampat', type: 'kabupaten', lat: -0.50, lng: 130.52 },
    { code: '9205', name: 'Kab. Teluk Bintuni', type: 'kabupaten', lat: -2.12, lng: 133.55 },
    { code: '9206', name: 'Kab. Teluk Wondama', type: 'kabupaten', lat: -2.77, lng: 134.58 },
    { code: '9207', name: 'Kab. Kaimana', type: 'kabupaten', lat: -3.67, lng: 133.77 },
    { code: '9208', name: 'Kab. Manokwari Selatan', type: 'kabupaten', lat: -1.53, lng: 133.93 },
    { code: '9209', name: 'Kab. Pegunungan Arfak', type: 'kabupaten', lat: -1.37, lng: 133.88 },
    { code: '9271', name: 'Kota Sorong', type: 'kota', lat: -0.88, lng: 131.25 }
  ],
  '93': [
    { code: '9301', name: 'Kab. Boven Digoel', type: 'kabupaten', lat: -5.67, lng: 140.27 },
    { code: '9302', name: 'Kab. Mappi', type: 'kabupaten', lat: -6.23, lng: 139.17 },
    { code: '9303', name: 'Kab. Asmat', type: 'kabupaten', lat: -5.38, lng: 138.47 }
  ],
  '94': [
    { code: '9401', name: 'Kab. Mimika', type: 'kabupaten', lat: -4.53, lng: 136.88 },
    { code: '9402', name: 'Kab. Paniai', type: 'kabupaten', lat: -3.80, lng: 136.37 },
    { code: '9403', name: 'Kab. Puncak', type: 'kabupaten', lat: -3.67, lng: 137.20 },
    { code: '9404', name: 'Kab. Dogiyai', type: 'kabupaten', lat: -3.88, lng: 135.82 },
    { code: '9405', name: 'Kab. Intan Jaya', type: 'kabupaten', lat: -3.57, lng: 136.55 },
    { code: '9406', name: 'Kab. Deiyai', type: 'kabupaten', lat: -3.85, lng: 136.07 }
  ],
  '95': [
    { code: '9501', name: 'Kab. Lanny Jaya', type: 'kabupaten', lat: -3.82, lng: 138.38 },
    { code: '9502', name: 'Kab. Nduga', type: 'kabupaten', lat: -4.47, lng: 138.62 },
    { code: '9503', name: 'Kab. Tolikara', type: 'kabupaten', lat: -3.67, lng: 138.58 },
    { code: '9504', name: 'Kab. Yalimo', type: 'kabupaten', lat: -3.85, lng: 139.53 },
    { code: '9505', name: 'Kab. Yahukimo', type: 'kabupaten', lat: -4.52, lng: 139.67 },
    { code: '9506', name: 'Kab. Pegunungan Bintang', type: 'kabupaten', lat: -4.58, lng: 140.28 }
  ],
  '96': [
    { code: '9601', name: 'Kab. Sorong Selatan', type: 'kabupaten', lat: -1.68, lng: 132.25 },
    { code: '9602', name: 'Kab. Maybrat', type: 'kabupaten', lat: -1.38, lng: 132.42 },
    { code: '9603', name: 'Kab. Tambrauw', type: 'kabupaten', lat: -0.75, lng: 132.40 }
  ]
};

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const prov of provinces) {
      await client.query(
        'INSERT INTO provinces (code, name) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
        [prov.code, prov.name]
      );
    }
    console.log(`Inserted ${provinces.length} provinces`);

    let cityCount = 0;
    for (const [provCode, cities] of Object.entries(citiesData)) {
      for (const city of cities) {
        await client.query(
          'INSERT INTO cities (code, province_code, name, type) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING',
          [city.code, provCode, city.name, city.type]
        );
        cityCount++;
      }
    }
    console.log(`Inserted ${cityCount} cities/kabupaten`);

    for (const op of operators) {
      await client.query(
        'INSERT INTO operators (mcc, mnc, name, brand, prefix) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        ['510', op.mnc, op.name, op.brand, op.prefix]
      );
    }
    console.log(`Inserted ${operators.length} operators`);

    let districtCount = 0;
    for (const [provCode, cities] of Object.entries(citiesData)) {
      for (const city of cities) {
        const districtNames = generateDistrictNames(city.name, city.type);
        for (let i = 0; i < districtNames.length; i++) {
          const dCode = city.code + String(i + 1).padStart(3, '0');
          await client.query(
            'INSERT INTO districts (code, city_code, name) VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',
            [dCode, city.code, districtNames[i]]
          );
          districtCount++;
        }
      }
    }
    console.log(`Inserted ${districtCount} districts`);

    let towerCount = 0;
    const operatorRows = await client.query('SELECT id, mnc, brand FROM operators');
    for (const [provCode, cities] of Object.entries(citiesData)) {
      for (const city of cities) {
        for (const op of operatorRows.rows) {
          const numTowers = city.type === 'kota' ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 8) + 3;
          for (let t = 0; t < numTowers; t++) {
            const cellId = Math.floor(Math.random() * 65535) + 1;
            const lac = Math.floor(Math.random() * 65535) + 1;
            const lat = city.lat + (Math.random() - 0.5) * 0.2;
            const lng = city.lng + (Math.random() - 0.5) * 0.2;
            const towerTypes = ['2G', '3G', '4G', '5G'];
            const bands = ['GSM 900', 'GSM 1800', 'UMTS 2100', 'LTE 1800', 'LTE 2300', 'NR 3500'];
            const towerType = towerTypes[Math.floor(Math.random() * towerTypes.length)];
            const band = bands[Math.floor(Math.random() * bands.length)];

            await client.query(
              `INSERT INTO bts_towers (cell_id, lac, mcc, mnc, operator_id, latitude, longitude, address, province_code, city_code, tower_type, azimuth, height_m, power_dbm, band)
               VALUES ($1, $2, '510', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
              [
                cellId, lac, op.mnc, op.id,
                parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)),
                `Tower ${op.brand} - ${city.name}`,
                provCode, city.code, towerType,
                Math.floor(Math.random() * 360),
                Math.floor(Math.random() * 40) + 20,
                Math.floor(Math.random() * 10) + 38,
                band
              ]
            );
            towerCount++;
          }
        }
      }
    }
    console.log(`Inserted ${towerCount} BTS towers`);

    const adminHash = require('bcryptjs').hashSync('admin123', 10);
    await client.query(
      `INSERT INTO users (username, email, password_hash, role, plan) VALUES ('admin', 'admin@bts-indonesia.id', $1, 'admin', 'vip') ON CONFLICT (username) DO NOTHING`,
      [adminHash]
    );
    console.log('Admin user created (admin/admin123)');

    await client.query('COMMIT');
    console.log('Database seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

function generateDistrictNames(cityName, cityType) {
  const baseName = cityName.replace(/^Kab\.\s*|^Kota\s*/i, '');
  const suffixes = ['Utara', 'Selatan', 'Timur', 'Barat', 'Tengah'];
  const count = cityType === 'kota' ? Math.min(5, suffixes.length) : Math.min(4, suffixes.length);
  const districts = [];
  for (let i = 0; i < count; i++) {
    districts.push(`${baseName} ${suffixes[i]}`);
  }
  return districts;
}

seed().catch(err => { console.error(err); process.exit(1); });
