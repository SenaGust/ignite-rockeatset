import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/utils/get-week-days";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { Container, Header } from "../styles";

import {
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  FormError,
} from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => {
      const filteredByEnabled = intervals.filter(({ enabled }) => enabled);

      return filteredByEnabled;
    })
    .refine((intervals) => intervals.length > 0, {
      message: "Você precisa selecionar pelo menos 1 dia da semana",
    })
    .transform((intervals) => {
      return intervals.map(({ startTime, endTime, weekDay }) => ({
        weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(startTime),
        endTimeInMinutes: convertTimeStringToMinutes(endTime),
      }));
    })
    .refine(
      (intervals) =>
        intervals.every(
          (interval) => interval.startTimeInMinutes <= interval.endTimeInMinutes
        ),
      {
        message:
          "O horário de término deve ser pelo menos 1h distante do início.",
      }
    ),
});

type TimeIntervalsFormDataInput = z.input<typeof timeIntervalsFormSchema>;

type TimeIntervalsFormDataOutput = z.output<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormDataInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });
  const router = useRouter();

  const { intervals } = watch();

  const weekDays = getWeekDays();

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const handleSetTimeIntervals = async (data: any) => {
    try {
      const { intervals }: TimeIntervalsFormDataOutput = data;
      await api.post("/users/time-intervals", { intervals });
      await router.push("/register/update-profile");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horário que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        checked={field.value}
                      />
                    )}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            );
          })}
        </IntervalContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
}
