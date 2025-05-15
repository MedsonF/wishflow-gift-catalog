import mercadopago from 'mercadopago';

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN || '',
});

interface PaymentPreferenceOptions {
  title: string;
  price: number;
  installments?: boolean;
  description?: string;
  payer_email?: string;
}

export const createPaymentLink = async ({
  title,
  price,
  installments = false,
  description = process.env.NEXT_PUBLIC_PAYMENT_DESCRIPTION,
  payer_email
}: PaymentPreferenceOptions) => {
  try {
    const maxInstallments = Number(process.env.NEXT_PUBLIC_MAX_INSTALLMENTS) || 12;

    const preference = {
      items: [
        {
          title,
          description,
          unit_price: price,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payment_methods: {
        excluded_payment_methods: installments ? [] : [{ id: 'credit_card' }],
        excluded_payment_types: installments ? [] : [{ id: 'credit_card' }],
        installments: installments ? maxInstallments : 1,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`,
      statement_descriptor: 'WISHFLOW GIFTS',
      ...(payer_email && {
        payer: {
          email: payer_email,
        },
      }),
    };

    const response = await mercadopago.preferences.create(preference);
    
    if (!response?.body?.init_point) {
      throw new Error('Não foi possível gerar o link de pagamento');
    }

    return {
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point,
    };
  } catch (error) {
    console.error('Erro ao criar link de pagamento:', error);
    throw new Error('Falha ao gerar link de pagamento. Por favor, tente novamente.');
  }
}; 