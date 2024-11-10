interface Props {
  readonly isNullableColumn?: boolean
}

export class ColumnBigIntTransformer {
  constructor(private readonly props?: Props) {}

  public to(data: number): number {
    return data
  }

  public from(data: string): number | null {
    const num = Number(data)

    if (this.props && this.props.isNullableColumn && data == null) {
      return data as null
    }

    if (isNaN(num)) {
      return 0
    }

    return num
  }
}
