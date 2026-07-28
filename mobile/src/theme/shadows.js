import { colors } from "./colors";

// Ombres diffuses et discretes, pensees pour la marque -- pas l'elevation
// Material par defaut (voir .claude/skills/design/SKILL.md).
export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  button: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
};
