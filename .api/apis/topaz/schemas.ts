const GetCreditBalance = {"response":{"200":{"type":"object","properties":{"available_credits":{"type":"integer","description":"The number of credits available to you.","examples":[100]},"reserved_credits":{"type":"integer","description":"The number of credits reserved by you (if applicable).","examples":[10]},"total_credits":{"type":"integer","description":"The total number of credits in your account (available credits + reserved credits).","examples":[110]}},"$schema":"http://json-schema.org/draft-04/schema#"}}} as const
;
export { GetCreditBalance }
