/**
 * Which of the two builds is running. Set by the build scripts, which write
 * EXPO_PUBLIC_APP_VARIANT into .env.local before exporting so that Metro
 * inlines it as a literal — a customer bundle can never flip to admin.
 */
export const isCustomerBuild = process.env.EXPO_PUBLIC_APP_VARIANT === 'customer';
