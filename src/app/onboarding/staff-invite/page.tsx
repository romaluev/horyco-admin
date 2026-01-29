/* eslint-disable max-lines */
'use client'

import { useState, useCallback } from 'react'


import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { getNextStep } from '@/shared/config/onboarding'
import { useFormPersist } from '@/shared/hooks/use-form-persist'
import { useUnsavedChangesWarning } from '@/shared/hooks/use-unsaved-changes-warning'
import { useRouter } from '@/shared/lib/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/base/alert-dialog'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { PhoneInput } from '@/shared/ui/base/phone-input'
import { OnboardingLayout } from '@/shared/ui/onboarding'

import { useGetAllPermissions } from '@/entities/auth/role'
import {
  useSubmitStaffInvite,
  useSkipStep,
  useStepValidation,
} from '@/entities/onboarding/onboarding'
import {
  staffInviteSchema,
  type StaffInviteFormValues,
} from '@/features/onboarding/onboarding/model'
import { PermissionsSelectorModal } from '@/features/onboarding/onboarding/ui/permissions-selector-modal'

import type { IPermission } from '@/entities/organization/employee'

interface InvitationPermissions {
  permissionIds: number[]
}

// eslint-disable-next-line max-lines-per-function
export default function StaffInvitePage() {
  const router = useRouter()
  const { t } = useTranslation('onboarding')
  const [isSkipConfirmOpen, setSkipConfirmOpen] = useState(false)
  const [permissionsMap, setPermissionsMap] = useState<
    Record<number, InvitationPermissions>
  >({})
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [selectedInvitationIndex, setSelectedInvitationIndex] = useState<number | null>(null)

  // Validate step access and get progress
  const { progress } = useStepValidation('staff_invited')
  const { data: allPermissionsData, isLoading: isLoadingPermissions } =
    useGetAllPermissions()
  const allPermissions = (allPermissionsData as IPermission[]) || []

  // Form initialization
  const form = useForm<StaffInviteFormValues>({
    resolver: zodResolver(staffInviteSchema),
    defaultValues: {
      invitations: [],
    },
  })

  // Draft saving functionality
  const { clearDraft } = useFormPersist(form, 'onboarding-staff-invite-draft', {
    exclude: ['email'], // Don't persist email for privacy
  })

  // Unsaved changes warning
  const { confirmNavigation } = useUnsavedChangesWarning(form.formState.isDirty)

  // Submit mutation
  const { mutate: submitStaffInvite, isPending: isSubmitting } =
    useSubmitStaffInvite({
      onSuccess: () => {
        clearDraft()
        const nextStep = getNextStep('staff_invited')
        router.push(nextStep?.route || '/onboarding/complete')
      },
    })

  // Skip mutation
  const { mutate: skipStep, isPending: isSkipping } = useSkipStep({
    onSuccess: () => {
      clearDraft()
      const nextStep = getNextStep('staff_invited')
      router.push(nextStep?.route || '/onboarding/complete')
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'invitations',
  })

  const isLoading = isSubmitting || isSkipping || isLoadingPermissions

  const handleOpenPermissionsModal = (index: number) => {
    setSelectedInvitationIndex(index)
    setIsPermissionsModalOpen(true)
  }

  const handleSavePermissions = (permissionIds: number[]) => {
    if (selectedInvitationIndex !== null) {
      handlePermissionsChange(selectedInvitationIndex, permissionIds)
    }
    setIsPermissionsModalOpen(false)
    setSelectedInvitationIndex(null)
  }

  const addInvitation = () => {
    const newIndex = fields.length
    append({
      fullName: '',
      phone: '',
      email: '',
    })
    // Initialize empty permissions for new invitation
    setPermissionsMap((prev) => ({
      ...prev,
      [newIndex]: {
        permissionIds: [],
      },
    }))
  }

  const handlePermissionsChange = useCallback(
    (invitationIndex: number, permissionIds: number[]) => {
      setPermissionsMap((prev) => ({
        ...prev,
        [invitationIndex]: {
          permissionIds,
        },
      }))
    },
    []
  )

  const onSubmit = async (data: StaffInviteFormValues) => {
    if (data.invitations.length === 0) {
      // Skip if no invitations
      handleSkip()
      return
    }

    submitStaffInvite({
      invitations: data.invitations.map((inv, index) => ({
        fullName: inv.fullName,
        phone: inv.phone,
        email: inv.email || undefined,
        permissionIds: permissionsMap[index]?.permissionIds || [],
      })),
    })
  }

  const handleSkip = () => {
    setSkipConfirmOpen(true)
  }

  const confirmSkip = () => {
    skipStep({
      step: 'staff_invited',
      reason: t('pages.staffInvite.skipReason'),
    })
    setSkipConfirmOpen(false)
  }

  return (
    <OnboardingLayout
      currentStep="staff_invited"
      completedSteps={progress?.completedSteps || []}
      skippedSteps={progress?.skippedSteps || []}
      title={t('pages.staffInvite.title')}
      description={t('pages.staffInvite.description')}
    >
      <>
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.staffInvite.cardTitle')}</CardTitle>
              <CardDescription>
                {t('pages.staffInvite.cardDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {fields.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        {t('pages.staffInvite.emptyState')}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInvitation}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('pages.staffInvite.addStaff')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* eslint-disable-next-line max-lines-per-function */}
                      {fields.map((field, index) => (
                        <Card key={field.id} className="gap-2">
                          <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {t('pages.staffInvite.staffNumber', { number: index + 1 })}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                remove(index)
                                setPermissionsMap((prev: Record<number, InvitationPermissions>) => {
                                  const updated = { ...prev }
                                  delete updated[index]
                                  return updated
                                })
                              }}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <FormField
                              control={form.control}
                              name={`invitations.${index}.fullName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('pages.staffInvite.fullName')}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t('pages.staffInvite.fullNamePlaceholder')}
                                      {...field}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`invitations.${index}.phone`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('pages.staffInvite.phone')}</FormLabel>
                                  <FormControl>
                                    <PhoneInput
                                      defaultCountry={'UZ'}
                                      placeholder={t('pages.staffInvite.phonePlaceholder')}
                                      limitMaxLength
                                      countries={['UZ']}
                                      {...field}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`invitations.${index}.email`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('pages.staffInvite.email')}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder={t('pages.staffInvite.emailPlaceholder')}
                                      {...field}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t('pages.staffInvite.emailOptional')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Permissions Selection */}
                            <div className="border-t pt-4">
                              <h3 className="mb-3 text-sm font-medium">
                                {t('pages.staffInvite.permissions')}
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenPermissionsModal(index)}
                                disabled={isLoading}
                                className="w-full"
                              >
                                {t('pages.staffInvite.selectPermissions', {
                                  count: permissionsMap[index]?.permissionIds?.length || 0,
                                })}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInvitation}
                        className="w-full"
                        disabled={isLoading}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('pages.staffInvite.addMore')}
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (confirmNavigation()) {
                          router.back()
                        }
                      }}
                      disabled={isLoading}
                    >
                      {t('pages.staffInvite.buttons.back')}
                    </Button>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSkip}
                        disabled={isLoading}
                      >
                        {t('pages.staffInvite.buttons.skip')}
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {fields.length > 0
                          ? t('pages.staffInvite.buttons.sendInvitations')
                          : t('pages.staffInvite.buttons.complete')}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Permissions Modal */}
          {selectedInvitationIndex !== null && (
            <PermissionsSelectorModal
              isOpen={isPermissionsModalOpen}
              onOpenChange={setIsPermissionsModalOpen}
              branchName="Филиал по умолчанию"
              allPermissions={allPermissions}
              currentPermissionIds={
                permissionsMap[selectedInvitationIndex]?.permissionIds || []
              }
              isLoading={isLoadingPermissions}
              onPermissionsSave={handleSavePermissions}
            />
          )}

          {/* Skip Confirmation Dialog */}
          <AlertDialog
            open={isSkipConfirmOpen}
            onOpenChange={setSkipConfirmOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('pages.staffInvite.skipDialog.title')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('pages.staffInvite.skipDialog.description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  {t('pages.staffInvite.skipDialog.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmSkip} disabled={isLoading}>
                  {t('pages.staffInvite.skipDialog.confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
    </OnboardingLayout>
  )
}
