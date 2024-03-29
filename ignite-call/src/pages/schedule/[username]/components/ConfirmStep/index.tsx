import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { CalendarBlank, Clock } from "phosphor-react";
import { ConfirmForm, FormActions, FormHeader, FormError } from "./styles";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Digite um e-mail válido" }),
  observations: z.string().optional(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancel: () => void;
}

export function ConfirmStep({ schedulingDate, onCancel }: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  });

  const router = useRouter();
  const username = String(router.query.username);

  const handleConfirm = async ({
    name,
    observations,
    email,
  }: ConfirmFormData) => {
    try {
      await api.post(`/users/${username}/schedule`, {
        name,
        observations,
        email,
        date: schedulingDate,
      });

      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const date = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const time = dayjs(schedulingDate).format("HH:mm");
  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirm)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {date}
        </Text>
        <Text>
          <Clock />
          {time}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo:</Text>
        <TextInput placeholder="Seu nome" {...register("name")} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput placeholder="example@example.com" {...register("email")} />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register("observations")} />
        {errors.observations && (
          <FormError size="sm">{errors.observations.message}</FormError>
        )}
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
