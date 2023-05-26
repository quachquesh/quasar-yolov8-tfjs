import type tfType from '@tensorflow/tfjs'

export interface IModel {
  net: tfType.GraphModel<string | tfType.io.IOHandler> | null
  inputShape: number[] | undefined
}
