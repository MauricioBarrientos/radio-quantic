import React, { useState } from 'react';
import { FaHeart, FaCoins } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const DonacionButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const stellarAddress = 'GABFQIK63R2NETJM7T673EAMZN4RJLLGP3OFUEJU5SZVTGWUKULZJNL6';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(stellarAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // No need for external QR code generation since we're using qrcode.react

  return (
    <div className="donacion-container">
      <button
        onClick={() => setShowModal(true)}
        className="donacion-button flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors duration-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
        aria-label="Botón de donación"
      >
        <FaHeart className="text-red-400" />
        <span>Donar</span>
      </button>

      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Apoya a Radio Quantic</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {/* Stellar Lumens Donation Option */}
              <div className="donation-option bg-gray-700 p-4 rounded-lg">
                <h4 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
                  <FaCoins className="text-blue-400" /> Stellar Lumens (XLM)
                </h4>
                <p className="text-gray-300 mb-3">
                  Escanea el código QR o copia la dirección
                </p>
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG
                      value={`stellar:${stellarAddress}`}
                      size={160}
                      level="H"
                      includeMargin={true}
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Dirección Stellar Lumens (XLM)
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={stellarAddress}
                    readOnly
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm truncate"
                    aria-label="Dirección Stellar Lumens"
                  />
                  <button
                    onClick={handleCopyAddress}
                    className="copy-button px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
                  >
                    {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default DonacionButton;