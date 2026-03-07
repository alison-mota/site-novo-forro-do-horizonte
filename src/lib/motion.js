export const breezeEase = [0.25, 0.8, 0.25, 1];

const groupProfiles = {
  shell: { enterX: 18, enterY: 0, exitX: 34, exitY: 0, duration: 0.92, delay: 0.04 },
  headline: { enterX: 42, enterY: 6, exitX: 72, exitY: -6, duration: 0.96, delay: 0.12, useFilter: false },
  "headline-fill": { enterX: 42, enterY: 6, exitX: 72, exitY: -6, duration: 0.96, delay: 0.12, useFilter: false },
  "headline-outline": {
    enterX: 42,
    enterY: 6,
    exitX: 72,
    exitY: -6,
    duration: 0.96,
    delay: 0.12,
    useFilter: false,
  },
  subcopy: { enterX: 28, enterY: 8, exitX: 56, exitY: 4, duration: 0.88, delay: 0.18 },
  cta: { enterX: 32, enterY: 10, exitX: 60, exitY: 10, duration: 0.9, delay: 0.24 },
  content: { enterX: 30, enterY: 8, exitX: 54, exitY: 6, duration: 0.9, delay: 0.2 },
  media: { enterX: 40, enterY: 4, exitX: 68, exitY: 2, duration: 0.96, delay: 0.14 },
  meta: { enterX: 20, enterY: 10, exitX: 34, exitY: 8, duration: 0.84, delay: 0.28 },
};

function resolveProfile(group) {
  return groupProfiles[group] ?? groupProfiles.content;
}

function byDirection(distance, direction, invert = false) {
  const sign = direction >= 0 ? 1 : -1;
  return invert ? distance * sign * -1 : distance * sign;
}

export function getGroupMotion(group, direction = 1) {
  const profile = resolveProfile(group);
  const filterInitial = profile.useFilter === false ? undefined : "blur(6px)";
  const filterAnimate = profile.useFilter === false ? undefined : "blur(0px)";

  return {
    initial: {
      opacity: 0,
      x: byDirection(profile.enterX, direction),
      y: profile.enterY,
      filter: filterInitial,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: filterAnimate,
      transition: {
        duration: profile.duration,
        delay: profile.delay,
        ease: breezeEase,
      },
    },
    exit: {
      opacity: 0,
      x: byDirection(profile.exitX, direction, true),
      y: profile.exitY,
      filter: filterInitial,
      transition: {
        duration: Math.max(profile.duration - 0.1, 0.72),
        ease: breezeEase,
      },
    },
  };
}

export function getSceneMotion(direction = 1) {
  return {
    initial: {
      opacity: 0.72,
      x: direction >= 0 ? "12%" : "-12%",
      scale: 1.01,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      x: "0%",
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.96,
        ease: breezeEase,
      },
    },
    exit: {
      opacity: 0.78,
      x: direction >= 0 ? "-16%" : "16%",
      scale: 0.995,
      filter: "blur(4px)",
      transition: {
        duration: 0.9,
        ease: breezeEase,
      },
    },
  };
}

export function getSunMotion(direction = 1) {
  return {
    initial: {
      opacity: 0,
      x: direction >= 0 ? 10 : -10,
      y: "-14vh",
      scale: 1.02,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.02,
        delay: 0.04,
        ease: breezeEase,
      },
    },
    exit: {
      opacity: 0.88,
      x: direction >= 0 ? -10 : 10,
      y: "-18vh",
      scale: 0.98,
      transition: {
        duration: 0.96,
        ease: breezeEase,
      },
    },
  };
}
