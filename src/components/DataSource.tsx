import type React from "react";

export const DataSource: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
        Sumber Data Resmi
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-blue-900">
              Badan Pusat Statistik (BPS)
            </h4>
          </div>
          <p className="text-slate-600 mb-4">
            BPS menyediakan data resmi tentang jumlah UMKM di Indonesia,
            termasuk di Jawa Barat. Data ini dikumpulkan melalui sensus ekonomi
            dan survei yang dilakukan secara berkala.
          </p>
          <a
            href="https://www.bps.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-800 hover:text-blue-900 font-medium"
          >
            Kunjungi Website BPS
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-blue-900">
              Dinas Koperasi dan UMKM Jawa Barat
            </h4>
          </div>
          <p className="text-slate-600 mb-4">
            Dinas Koperasi dan UMKM Jawa Barat menyediakan data spesifik tentang
            UMKM di wilayah Jawa Barat, termasuk jumlah, jenis, dan distribusi
            geografisnya.
          </p>
          <a
            href="https://diskumkm.jabarprov.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-800 hover:text-blue-900 font-medium"
          >
            Kunjungi Website Dinas Koperasi
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-blue-900">
              Kementerian Koperasi dan UKM
            </h4>
          </div>
          <p className="text-slate-600 mb-4">
            Kementerian Koperasi dan UKM menyediakan data nasional tentang UMKM,
            termasuk data per provinsi.
          </p>
          <a
            href="https://www.kemenkopukm.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-800 hover:text-blue-900 font-medium"
          >
            Kunjungi Website Kementerian
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-800 shadow-sm">
        <div className="flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-800 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h4 className="font-semibold text-blue-900">Catatan Penting:</h4>
        </div>
        <ul className="space-y-2 pl-8 text-slate-700">
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-800 rounded-full mt-2 mr-2"></span>
            Data yang digunakan dalam aplikasi ini berasal dari sumber resmi
            yang disebutkan di atas.
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-800 rounded-full mt-2 mr-2"></span>
            Prediksi dan estimasi yang dihasilkan oleh aplikasi ini adalah
            perkiraan berdasarkan model matematis dan tidak menjamin keakuratan
            100%.
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-800 rounded-full mt-2 mr-2"></span>
            Pengguna disarankan untuk selalu merujuk ke sumber data resmi untuk
            informasi terbaru dan paling akurat.
          </li>
        </ul>
      </div>
    </div>
  );
};
