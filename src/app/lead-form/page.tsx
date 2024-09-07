"use client"

// pages/lead-form.tsx
import React, { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { useRouter } from 'next/navigation'
import InputMask from 'react-input-mask'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import formLogo from '../../public/form-logo.png'

const LeadForm = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [automationUsage, setAutomationUsage] = useState('')
  const [learningGoal, setLearningGoal] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Estado para loading

  const [emailError, setEmailError] = useState<string | null>(null) // Estado para erro de e-mail
  const [whatsappError, setWhatsappError] = useState<string | null>(null) // Estado para erro de WhatsApp

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Iniciar o loading
    setIsLoading(true)

    // Resetar os erros
    setEmailError(null)
    setWhatsappError(null)

    try {
      // Verificar se já existe um usuário com o mesmo e-mail
      const { data: existingEmailUser, error: emailFetchError } = await supabase
        .from('Leads')
        .select('*')
        .eq('email', email)

      if (emailFetchError) {
        console.error('Erro ao verificar e-mail:', emailFetchError)
        alert('Erro ao verificar e-mail.')
        setIsLoading(false)
        return
      }

      if (existingEmailUser && existingEmailUser.length > 0) {
        setEmailError('Este e-mail já está registrado.')
        setIsLoading(false)
        return
      }

      // Verificar se já existe um usuário com o mesmo WhatsApp
      const { data: existingWhatsappUser, error: whatsappFetchError } = await supabase
        .from('Leads')
        .select('*')
        .eq('whatsapp', whatsapp)

      if (whatsappFetchError) {
        console.error('Erro ao verificar WhatsApp:', whatsappFetchError)
        alert('Erro ao verificar WhatsApp.')
        setIsLoading(false)
        return
      }

      if (existingWhatsappUser && existingWhatsappUser.length > 0) {
        setWhatsappError('Este número de WhatsApp já está registrado.')
        setIsLoading(false)
        return
      }

      // Inserir novo usuário se não houver duplicatas
      const { error } = await supabase.from('Leads').insert([
        {
          name: fullName,
          email,
          whatsapp,
          uses_automation_ai: automationUsage,
          learning_goals: learningGoal,
        },
      ])

      if (error) {
        console.error('Erro ao enviar o formulário:', error)
        alert('Erro ao enviar o formulário.')
      } else {
        router.push('/thank-you')
      }
    } catch (err) {
      console.error('Erro ao enviar o formulário:', err)
      alert('Erro ao enviar o formulário.')
    } finally {
      setIsLoading(false) // Finaliza o loading
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 sm:my-12">
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full space-y-6 text-gray-700" onSubmit={handleSubmit}>
        <div className='flex items-center mb-8'> 
          <Image src={formLogo} alt="Logo" width={85} height={85} className='rounded-full' />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
            Curso Gratuito: Criando um Chat Integrado ao WhatsApp com IA
          </h1>
        </div>

        <p className='font-bold'>Bem vindo(a)!</p>
        <p>
          Eu criei este formulário para entender melhor as suas <span className='font-bold'>necessidades e interesses sobre automação e inteligência artificial na área da saúde</span>. Meu objetivo é oferecer um <span className='font-bold'>curso gratuito</span> que vai te ensinar a criar seu <span className='font-bold'>primeiro chatbot integrado ao WhatsApp</span>, capacitando você a entender as bases da criação de um bot que ajudará a <span className='font-bold'>automatizar processos em clínicas e consultórios</span>.
        </p>
        <p>
          Peço que você preencha as informações a seguir para que eu possa lhe enviar o <span className='font-bold'>link do curso</span> assim que ele estiver disponível e também <span className='font-bold'>ajustar o conteúdo</span> para atender melhor às suas expectativas.
        </p>

        <Separator />

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nome Completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            placeholder="Digite seu nome completo"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-500 ${emailError ? 'border-red-500' : ''}`}
            placeholder="Digite seu e-mail"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Número de WhatsApp</label>
          <InputMask
            mask="(99) 99999-9999" // Máscara para o número de celular (11 dígitos)
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={`w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-500 ${whatsappError ? 'border-red-500' : ''}`}
            placeholder="Digite seu número de whatsApp"
          />
          {whatsappError && <p className="text-red-500 text-sm mt-1">{whatsappError}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Você já utiliza automações ou IA na sua prática profissional?
          </label>
          <RadioGroup onValueChange={(value) => setAutomationUsage(value)} value={automationUsage}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim, utilizo regularmente" id="r1" />
              <label htmlFor="r1" className="text-gray-700">Sim, utilizo regularmente</label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim, mas de forma limitada" id="r2" />
              <label htmlFor="r2" className="text-gray-700">Sim, mas de forma limitada</label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não, mas estou interessado em aprender" id="r3" />
              <label htmlFor="r3" className="text-gray-700">Não, mas estou interessado em aprender</label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            O que você gostaria de aprender a fazer com automação e IA?
          </label>
          <textarea
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            required
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            placeholder="Descreva seus interesses"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading} // Desativa o botão quando está carregando
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6"><Loader2 /></div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LeadForm
