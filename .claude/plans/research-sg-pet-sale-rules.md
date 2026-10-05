# Research: Singapore rules for selling pets (input to PRs 3, 5 and 6)

Checked 2026-10-02 by a research agent. **This is not legal advice.** Confirm the open items with AVS or a lawyer before launch. The primary source is AVS at avs.nparks.gov.sg (the old nparks.gov.sg/avs links return 404).

## Key rules

| Topic                 | Rule                                                                                                                                                                                                                                                                                       | Source                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seller licences       | **Pet shops:** AVS _Licence for Pet Shop_. Format seen in the registry: `AS` + yy + month letter + 4–5 digits (e.g. `AS19J00045`). **Breeders:** farm licence with dog- or cat-breeding conditions. Format seen: `BR` + 5 digits (e.g. `BR25008`). Neither format is officially published. | [Pet shop conditions](https://avs.nparks.gov.sg/businesses/pet-shop-owners/licensing-conditions/), [breeder info](https://avs.nparks.gov.sg/businesses/breeders/general-information/), [shop registry](https://avs.nparks.gov.sg/outreach/resources/public-registry-of-avs-licensed-pet-shops/), [breeder registry](https://avs.nparks.gov.sg/outreach/resources/public-registry-of-avs-licensed-pet-breeders/) |
| Adverts               | Pet shops must show their licence number in every advert, including online (condition 38). Dog breeders must show their name and licence number (9.2). Breeders may only advertise animals they bred (9.1).                                                                                | Same                                                                                                                                                                                                                                                                                                                                                                                                            |
| Unlicensed selling    | Offence under s48(1) of the Animals and Birds Act. First jail sentence was [2026] SGMC 93, for puppies sold on Instagram.                                                                                                                                                                  | Search results                                                                                                                                                                                                                                                                                                                                                                                                  |
| Minimum age           | **Puppies at least 9 weeks**; kittens at least 12 weeks; animals must be weaned. Buyer must be at least 16.                                                                                                                                                                                | Shop conditions 11, 12, 28; breeder 9.4                                                                                                                                                                                                                                                                                                                                                                         |
| Microchip and licence | Puppies microchipped by 9 weeks, kittens by 12 weeks. All dogs and cats must be licensed. Ownership is transferred in PALS before handover.                                                                                                                                                | Shop conditions 20, 21, 25; breeder 6.9                                                                                                                                                                                                                                                                                                                                                                         |
| Health                | Two vaccinations followed by at least 7 days' rest (dogs: distemper, parvovirus, hepatitis). At least two dewormings. A vaccination card goes with the animal, showing microchip number, breed, sex, age, colour, vaccine and vet.                                                         | Shop conditions                                                                                                                                                                                                                                                                                                                                                                                                 |
| Restricted breeds     | **Specified dogs Part 1** (Pit Bull, Akita, Tosa, Dogo Argentino, and others, plus crosses): shops may not sell them. **Part 2** (Rottweiler, Dobermann, German Shepherd, Bull Terrier, Mastiff, and others): heavy conditions. Neither part is allowed in HDB flats.                      | [Specified dogs](https://avs.nparks.gov.sg/pets/licensing-a-pet/information-on-dog-and-cat-licences/specified-dogs/)                                                                                                                                                                                                                                                                                            |
| HDB                   | One approved-breed dog per flat. About 62 approved breeds, plus crosses of two approved breeds. Size limits are unconfirmed.                                                                                                                                                               | [HDB](https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/keeping-pets)                                                                                                                                                                                                                                                                                                                                    |
| Rehoming              | Voluntary guidelines: adoption agreement, health and behaviour disclosure, sterilisation, return policy.                                                                                                                                                                                   | [Rehoming guidelines](https://avs.nparks.gov.sg/outreach/resources/guidelines-dog-rehoming-adoption/)                                                                                                                                                                                                                                                                                                           |
| UEN                   | `^(\d{8}[A-Z]\|(18\|19\|20)\d{7}[A-Z]\|[RST]\d{2}[A-Z][A-Z0-9]\d{4}[A-Z])$`, from secondary sources                                                                                                                                                                                        | –                                                                                                                                                                                                                                                                                                                                                                                                               |

## Effect on the plan

1. **Seller accounts (PR 3)** add:
   - `seller_type` (`pet_shop` or `breeder`; `animal_shelter` later), plus the species the licence covers (`seller_species`)
   - `licence_type`, `licence_expiry`, approved animal types
   - legal name matching ACRA
   - a check on the licence-number format
2. **Seller licence number is shown publicly** on every listing, because the law requires it in adverts.
3. **Dog listings (PR 5) need structured health data**, not booleans:
   - `microchip_no` (15 digits; visible to admins only)
   - a vaccinations table (date, vaccine, vet, clinic)
   - deworming dates
   - source of the animal (bred on premises, licensed breeder, imported)
4. **Validation and gates:**
   - Puppies must be at least 9 weeks old at the earliest handover date.
   - Part 1 specified breeds are blocked.
   - Part 2 breeds are labelled.
   - Breeds get a `specified_dog_part` column next to `hdb_approved`.
5. **Admin review (PR 6)** needs evidence to check against: the licence, the ACRA profile and the vaccination card. **That means storing documents privately in v1**, even though public listing photos are out of scope.

## Draft admin review checklist

1. Licence number is in the current AVS registry, and the name and address match ACRA.
2. Licence covers the species.
3. Age meets the minimum, based on the date of birth on the vaccination card.
4. Vaccination card matches the listing: microchip number, breed, sex, date of birth, colour, vet signature.
5. Vaccine types and dates are correct and the 7-day rest is met.
6. Breed is not Part 1. Part 2 breeds are labelled, and HDB eligibility is correct.
7. Source is consistent with the seller type (breeders list their own animals; shops source from licensed breeders). Import permit and 72-hour rest checked where relevant.
8. No welfare red flags.

## Open questions (for AVS or a lawyer)

- Does Bibble, as a platform, have its own duties? Is a listing the seller's "advertisement"?
- Does the 9-week minimum apply when listing, or only at sale or handover?
- Official licence number formats. Is there an API or bulk data for registry checks?
- The official HDB breed list and size limits.
- Do welfare groups that rehome for a fee need an AVS licence?
- Microchip number formats that PALS accepts.
