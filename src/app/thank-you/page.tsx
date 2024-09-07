// pages/thankyou.tsx
import React from 'react'

const ThankYouPage = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 mt-40">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Obrigado por se inscrever!</h1>
        <p className="text-gray-600">
          Enviarei uma mensagem para o e-mail que você forneceu assim que o curso gratuito estiver pronto, com o link para acessar o conteúdo.
        </p>
        <br></br>
        <p className='text-right text-gray-400'>- Matheus Adorno</p>
      </div>
    </div>
  )
}

export default ThankYouPage
