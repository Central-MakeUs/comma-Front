export interface questionInfo {
  order: number;
  title: string;
  options: [
    {
      code: string;
      label: string;
      description: string;
    }
  ];
}
